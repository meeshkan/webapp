import React, { useState } from "react";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import {
  Grid,
  Heading,
  Image,
  Link as ChakraLink,
  Stack,
  Text,
  useColorMode,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Flex,
  Code,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  ModalFooter,
  useDisclosure,
  useToast,
  useClipboard,
  UseToastOptions,
  LightMode,
  Avatar,
  Divider,
} from "@chakra-ui/core";
import { ChevronRightIcon, ArrowUpDownIcon } from "@chakra-ui/icons";
import { GithubIcon, AddIcon, FallbackIcon } from "../theme/icons";
import { useRouter, NextRouter } from "next/router";
import * as t from "io-ts";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import { flow, constant, constNull, constVoid } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import * as Ord from "fp-ts/lib/Ord";
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as _E from "../fp-ts/Either";
import * as _RTE from "../fp-ts/ReaderTaskEither";
import { NonEmptyArray, groupSort } from "fp-ts/lib/NonEmptyArray";
import { LensTaskEither, lensTaskEitherHead } from "../monocle-ts";
import {
  GET_TEAM_QUERY,
  UPDATE_TEAM_MUTATION,
  CREATE_PROJECT_MUTATION,
} from "../gql/pages/[teamName]";
import {
  defaultGQLErrorHandler,
  GET_SERVER_SIDE_PROPS_ERROR,
  INCORRECT_TYPE_SAFETY,
  INVALID_TOKEN_ERROR,
  NOT_LOGGED_IN,
  TEAM_DOES_NOT_EXIST,
  UNDEFINED_ERROR,
  UNKNOWN_GRAPHQL_ERROR,
} from "../utils/error";
import { eightBaseClient } from "../utils/graphql";
import { confirmOrCreateUser, getUserIdFromIdOrEnv } from "../utils/user";
import { getGHOAuthState } from "../utils/oauth";
import { SEPARATOR } from "../utils/separator";
import { useTeams } from "../utils/teams";
import {
  Loading,
  hookNeedingFetch,
  InitialLoading,
} from "../utils/hookNeedingFetch";
import {
  NegativeGithubFetchOutcome,
  IOwner,
  IRepository,
  Repository,
  TEAM_IMPORT_PROJECT,
} from "../utils/gh";
import { withSession } from "./api/session";
import ReactGA from "react-ga";
import Card from "../components/molecules/card";
import { withError } from "../components/molecules/error";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { mixpanelize } from "../utils/mixpanel-client";
import {
  stripe,
  createCustomerId,
  getPlan,
  FREE_PLAN,
  planToTitle,
  createPlanIfNoPlan,
} from "../utils/stripe";

type NegativeTeamFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | UNKNOWN_GRAPHQL_ERROR
  | INCORRECT_TYPE_SAFETY
  | INCORRECT_TYPE_SAFETY;

type QueryTp = t.TypeOf<typeof queryTp>;
type ITeamProps = {
  team: ITeamWithStripe;
  id: string;
  plan: string;
  session: ISession;
  ghOauthState: string;
};
type NegativeImportProjectOutcome = UNDEFINED_ERROR | INCORRECT_TYPE_SAFETY;
type NegativeUpdateTeamOutcome = UNDEFINED_ERROR | INCORRECT_TYPE_SAFETY;
type ITeam = t.TypeOf<typeof Team>;
export type ITeamWithStripe = t.TypeOf<typeof TeamWithStripe>;
type IRepositoriesGroupedByOwner = NonEmptyArray<IRepository>[];
type ImportProps = {
  teamName: string;
  session: ISession;
  repoName: String;
  onClick: TE.TaskEither<NegativeImportProjectOutcome, void>;
};
type ITeamUpdate = t.TypeOf<typeof TeamUpdate>;

const TeamUpdate = t.type({
  teamName: t.union([t.null, t.string]),
  newTeamName: t.union([t.null, t.string]),
  userId: t.union([t.null, t.string]),
});

const _Team = t.type({
  id: t.string,
  name: t.string,

  image: t.union([
    t.null,
    t.type({
      downloadUrl: t.string,
    }),
  ]),
  inviteLink: t.string,
  users: t.type({
    items: t.array(
      t.type({
        email: t.string,
        status: t.string,
        avatar: t.union([
          t.null,
          t.type({
            downloadUrl: t.string,
          }),
        ]),
      })
    ),
  }),
  project: t.type({
    items: t.array(
      t.type({
        name: t.string,
        repository: t.type({
          nodeId: t.string,
          owner: t.string,
        }),
        configuration: t.union([
          t.null,
          t.type({
            id: t.string,
          }),
        ]),
      })
    ),
  }),
});

const Team = t.intersection([
  _Team,
  t.type({
    stripeCustomerId: t.union([t.string, t.null]),
  }),
]);

const TeamWithStripe = t.intersection([
  _Team,
  t.type({
    stripeCustomerId: t.string,
  }),
]);

const queryTp = t.type({
  user: t.type({
    team: t.type({
      items: t.array(Team),
    }),
  }),
});

interface ImportProjectVariables {
  userId: string;
  teamName: string;
  closeModal: () => void;
  repositoryName: string;
  owner: string;
  nodeID: string;
  nodePlusTeam: string;
  namePlusTeam: string;
  router: NextRouter;
  importProjectIsExecuting: React.Dispatch<React.SetStateAction<boolean>>;
  toast: (props: UseToastOptions) => void;
}

export const getTeam = (teamName: string) => (
  session: ISession
): TE.TaskEither<NegativeTeamFetchOutcome, ITeam> =>
  pipe(
    TE.tryCatch(
      () => eightBaseClient(session).request(GET_TEAM_QUERY, { teamName }),
      defaultGQLErrorHandler("get team query")
    ),
    TE.chainEitherK(
      flow(
        queryTp.decode,
        E.mapLeft(
          (errors): NegativeTeamFetchOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not decode team name query | team fetch",
            errors,
          })
        )
      )
    ),
    LensTaskEither.fromPath<NegativeTeamFetchOutcome, QueryTp>()([
      "user",
      "team",
      "items",
    ]).compose(
      lensTaskEitherHead<NegativeTeamFetchOutcome, ITeam>(
        TE.left({
          type: "TEAM_DOES_NOT_EXIST",
          msg: `Could not find team for: ${teamName}`,
        })
      )
    ).get
  );

const userType = t.type({ id: t.string });
const updateTeamVariables = t.type({
  teamName: t.string,
  userId: t.string,
  newTeamName: t.string,
});
type UpdateTeamVariables = t.TypeOf<typeof updateTeamVariables> & {
  toast: (props: UseToastOptions) => void;
  router: NextRouter;
};

const ImportProject = ({
  repoName,
  onClick,
  teamName,
  session,
}: ImportProps) => {
  const { colorMode } = useColorMode();
  return (
    <Button
      w="full"
      variant="ghost"
      onClick={mixpanelize(
        session,
        "Clicked a button",
        {
          to: `https://app.meeshkan.com/${teamName}/{newProject}`,
          from: `https://app.meeshkan.com/${teamName}`,
          c2a: "Import a project",
        },
        onClick
      )}
      justifyContent="space-between"
      color={`mode.${colorMode}.text`}
    >
      <Flex align="center">
        <GithubIcon mr={2} />
        <Text>{repoName}</Text>
      </Flex>
      <ChevronRightIcon />
    </Button>
  );
};

const createProject = ({
  importProjectIsExecuting,
  toast,
  closeModal,
  router,
  ...importProjectVariables
}: ImportProjectVariables) => (
  session: ISession
): TE.TaskEither<NegativeImportProjectOutcome, void> =>
  TE.bracket<NegativeImportProjectOutcome, void, void>(
    () =>
      Promise.resolve(
        E.right<NegativeImportProjectOutcome, void>(
          importProjectIsExecuting(true)
        )
      ),
    () =>
      pipe(
        TE.tryCatch(
          () =>
            eightBaseClient(session).request(
              CREATE_PROJECT_MUTATION,
              importProjectVariables
            ),
          (error): NegativeImportProjectOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Could not make import project mutation",
            error,
          })
        ),
        TE.chain((_) => TE.right(constVoid())),
        TE.mapLeft((l) =>
          pipe(
            toast({
              title: "Oh no!",
              description:
                "We could not import your repository. Please try again soon!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-right",
            }),
            constant(l)
          )
        )
      ),
    (_, e) => () =>
      router
        .push(
          `/${importProjectVariables.teamName}/${importProjectVariables.repositoryName}/configuration`
        )
        .then((_) =>
          E.right(
            {
              _: closeModal(),
              __: importProjectIsExecuting(false),
              ___: ReactGA.event({
                category: "Projects",
                action: "Created",
                label: "index.tsx",
              }),
            }._
          )
        )
  );

const ordRepositoryByOwner: Ord.Ord<IRepository> = {
  compare: (repo0, repo1) =>
    Ord.ordString.compare(repo0.owner.login, repo1.owner.login),
  equals: (repo0, repo1) => repo0.owner.login === repo1.owner.login,
};

const groupReposByOwner = (repos: IRepository[]): IRepositoriesGroupedByOwner =>
  groupSort(ordRepositoryByOwner)(repos);

const useRepoList = (
  owner: E.Either<
    Loading,
    E.Either<NegativeGithubFetchOutcome, O.Option<IOwner>>
  >,
  setOwner: React.Dispatch<
    React.SetStateAction<
      E.Either<Loading, E.Either<NegativeGithubFetchOutcome, O.Option<IOwner>>>
    >
  >,
  setOwnerRepos: React.Dispatch<
    React.SetStateAction<
      E.Either<
        Loading,
        E.Either<
          NegativeGithubFetchOutcome,
          O.Option<NonEmptyArray<IRepository>>
        >
      >
    >
  >
) =>
  hookNeedingFetch<
    E.Either<NegativeGithubFetchOutcome, IRepositoriesGroupedByOwner>
  >(
    pipe(
      TE.tryCatch(
        () => fetch("/api/gh/repos"),
        (error) => ({
          type: "UNDEFINED_ERROR",
          msg: "Could not fetch api/gh/repos from index.tsx",
          error,
        })
      ),
      TE.chain((res) =>
        res.ok
          ? TE.tryCatch(
              () => res.json(),
              (error) => ({
                type: "UNDEFINED_ERROR",
                msg:
                  "Could not convert result of api/gh/repos to json from index.tsx",
                error,
              })
            )
          : TE.left({
              type: "REST_ENDPOINT_ERROR",
              msg: `Could not call internal endpoint api/gh/repos: ${res.status} ${res.statusText}`,
            })
      ),
      TE.chain(
        flow(
          t.array(Repository).decode,
          E.mapLeft((errors) => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not parse repository from github",
            errors,
          })),
          TE.fromEither
        )
      ),
      TE.chain(flow(groupReposByOwner, TE.right)),
      TE.chainFirst((repos) =>
        pipe(
          E.isLeft(owner) || E.isLeft(owner.right)
            ? [
                setOwner(
                  E.right(
                    E.right(
                      pipe(
                        A.head(repos),
                        O.chain((repoList) => O.some(NEA.head(repoList).owner))
                      )
                    )
                  )
                ),
                setOwnerRepos(E.right(E.right(A.head(repos)))),
              ]
            : [],
          TE.right
        )
      )
    )
  );

const updateTeam = ({
  toast,
  router,
  ...updateTeamVariables
}: UpdateTeamVariables) => (
  session: ISession
): TE.TaskEither<NegativeUpdateTeamOutcome, void> =>
  TE.bracket<NegativeUpdateTeamOutcome, void, void>(
    () =>
      Promise.resolve(E.right<NegativeUpdateTeamOutcome, void>(constNull())),
    () =>
      pipe(
        TE.tryCatch(
          () =>
            eightBaseClient(session).request(
              UPDATE_TEAM_MUTATION,
              updateTeamVariables
            ),
          (error): NegativeUpdateTeamOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Could not make update team mutation",
            error,
          })
        ),
        TE.mapLeft(
          (l) =>
            ({
              _: toast({
                title: "Oh no!",
                description:
                  "We could not update your team name. Please try again soon!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
              }),
              __: l,
            }.__)
        ),
        TE.chain((_) => TE.right(constNull()))
      ),
    (_, e) => () =>
      router.push(`/${updateTeamVariables.newTeamName}/`).then((_) =>
        E.right(
          {
            _: ReactGA.event({
              category: "Teams",
              action: "Updated",
              label: "[teamName].tsx",
            }),
          }._
        )
      )
  );

export const getServerSideProps = ({
  params: { teamName },
  req,
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, ITeamProps>;
}> =>
  pipe(
    _RTE.seq3([
      confirmOrCreateUser("id", userType),
      getTeam(teamName),
      RTE.fromReaderEither(getGHOAuthState(`/${teamName}/?displayPicker=true`)),
    ]),
    RTE.chain(([{ id }, team, ghOauthState]) => (session) =>
      team.stripeCustomerId !== null
        ? TE.right({ ghOauthState, id, team })
        : pipe(
            createCustomerId(id, team.name)(session),
            TE.chain((customerId) =>
              TE.right({
                id,
                ghOauthState,
                team: {
                  ...team,
                  stripeCustomerId: customerId,
                },
              })
            )
          )
    ),
    RTE.chain(({ id, team, ghOauthState }) => (session) =>
      TE.tryCatch(
        () =>
          stripe()
            .customers.retrieve(team.stripeCustomerId)
            .then((res) => ({
              session,
              ghOauthState,
              plan: getPlan(res),
              id,
              team,
            })),
        () => ({
          type: "STRIPE_ERROR",
          msg: "Could not create a stripe customer",
        })
      )
    ),
    RTE.chain(({ id, team, ghOauthState }) => (_) =>
      TE.tryCatch(
        () =>
          stripe()
            .customers.retrieve(team.stripeCustomerId)
            .then((res) => ({
              ghOauthState,
              plan: getPlan(res),
              id,
              team,
            })),
        () => ({
          type: "STRIPE_ERROR",
          msg: "Could not create a stripe customer",
        })
      )
    ),
    RTE.chain(({ id, team, ghOauthState, plan }) => (session) =>
      pipe(
        createPlanIfNoPlan(team.stripeCustomerId)(plan),
        TE.chain((_) =>
          TE.right({
            session,
            ghOauthState,
            plan: FREE_PLAN,
            id,
            team,
          })
        )
      )
    ),
    withSession(req, "[teamName].tsx getServerSideProps")
  )().then(_E.eitherSanitizedWithGenericError);

export default withError<GET_SERVER_SIDE_PROPS_ERROR, ITeamProps>(
  "Uh oh. Looks like this resource does not exist.",
  ({ team, id, session, ghOauthState, plan }) =>
    pipe(
      {
        useColorMode: useColorMode(),
        test: console.log("hello"),
        router: useRouter(),
        useDisclosure: useDisclosure(),
        teamsFromClientSideFetch: useTeams(session),
        useClipboard: useClipboard(team.inviteLink),
        useOwner: useState<
          E.Either<
            Loading,
            E.Either<NegativeGithubFetchOutcome, O.Option<IOwner>>
          >
        >(E.left(InitialLoading)),
        importProjectIsExecuting: useState(false),
        useOwnerRepos: useState<
          E.Either<
            Loading,
            E.Either<
              NegativeGithubFetchOutcome,
              O.Option<NonEmptyArray<IRepository>>
            >
          >
        >(E.left(InitialLoading)),
        toast: useToast(),
        useForm: useForm({
          // ...(configuration ? { defaultValues: configuration } : {}),
        }),
      },
      (p) => ({
        ...p,
        displayPicker: pipe(
          useState(p.router.query.displayPicker ? true : false),
          (dp) => {
            console.log("DP", dp[0], p.router.query.displayPicker);
            if (dp[0]) {
              // forces open if query asks to display picker
              p.useDisclosure.onOpen();
              dp[1](false);
            }
            return dp;
          }
        ),
        onSubmit: (values: ITeamUpdate) =>
          updateTeam({
            toast: p.toast,
            router: p.router,
            ...values,
            teamName: team.name,
            newTeamName: values.newTeamName,
            userId: getUserIdFromIdOrEnv(id),
          })(session)().then(constNull),
        repoListAndThunk: useRepoList(
          p.useOwner[0],
          p.useOwner[1],
          p.useOwnerRepos[1]
        ),
      }),
      ({
        repoListAndThunk,
        router,
        teamsFromClientSideFetch,
        importProjectIsExecuting,
        toast,
        useClipboard: [hasCopied, onCopy],
        useColorMode: { colorMode },
        useDisclosure: { onOpen, isOpen, onClose },
        useOwner: [owner, setOwner],
        useOwnerRepos: [ownerRepos, setOwnerRepos],
        useForm: { handleSubmit, formState, register },
        onSubmit,
      }) => (
        <>
          <Grid templateColumns="repeat(3, 1fr)" templateRows="auto" gap={8}>
            <Card
              session={session}
              gridArea="1 / 1 / 2 / 2"
              heading="Team settings"
            >
              <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                <Flex align="center" mt={4}>
                  <Image
                    src={team.image && team.image.downloadUrl}
                    fallbackSrc="https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
                    h={8}
                    w={8}
                    borderRadius="sm"
                    mr={4}
                    alt={`Uploaded logo from ${team.name}`}
                  />
                  <Box>
                    <FormLabel
                      color={`mode.${colorMode}.text`}
                      fontSize="sm"
                      p="0 0 4px 0"
                      mb={0}
                    >
                      Logo
                    </FormLabel>
                    <Text
                      color={`mode.${colorMode}.tertiary`}
                      fontStyle="italic"
                      fontSize="xs"
                      lineHeight="1"
                    >
                      Suggested size 250x250
                    </Text>
                  </Box>
                </Flex>
                <FormControl d="flex" mt={4} alignItems="center">
                  <FormLabel color={`mode.${colorMode}.text`}>Name:</FormLabel>
                  <Input
                    defaultValue={team.name}
                    name="newTeamName"
                    ref={register}
                    borderColor={`mode.${colorMode}.icon`}
                    borderRadius="sm"
                    size="sm"
                    color={`mode.${colorMode}.title`}
                    fontWeight={600}
                  />
                </FormControl>
                <FormControl d="flex" mt={4}>
                  <FormLabel color={`mode.${colorMode}.text`}>Plan:</FormLabel>
                  <Text color={`mode.${colorMode}.title`} fontWeight={600}>
                    {planToTitle[plan]}
                  </Text>
                  {plan === FREE_PLAN ? (
                    <Link passHref href={`/${team.name}/plan`}>
                      <ChakraLink fontWeight={600} ml={2}>
                        {`-> Upgrade`}
                      </ChakraLink>
                    </Link>
                  ) : null}
                </FormControl>
                <Box h={65} />
                <Flex
                  justify="flex-end"
                  pos="absolute"
                  bottom={4}
                  right={4}
                  left={4}
                  borderTop="1px solid"
                  borderTopColor={`mode.${colorMode}.icon`}
                >
                  <LightMode>
                    <Button
                      type="submit"
                      size="sm"
                      mt={4}
                      colorScheme="blue"
                      isLoading={formState.isSubmitting}
                    >
                      Save
                    </Button>
                  </LightMode>
                </Flex>
              </Box>
            </Card>

            <Card
              session={session}
              gridArea="2 / 1 / 3 / 2"
              heading={`Team members - ${team.users.items.length}`}
            >
              <FormControl>
                <FormLabel
                  fontWeight={500}
                  color={`mode.${colorMode}.title`}
                  mt={4}
                >
                  Invite link
                </FormLabel>
                <Stack direction="row">
                  <Input
                    value={team.inviteLink}
                    isReadOnly
                    size="sm"
                    borderRadius="sm"
                    borderColor={`mode.${colorMode}.icon`}
                    color={`mode.${colorMode}.text`}
                  />
                  <LightMode>
                    <Button
                      onClick={onCopy}
                      ml={2}
                      size="sm"
                      colorScheme="blue"
                    >
                      {hasCopied ? "Copied" : "Copy"}
                    </Button>
                  </LightMode>
                </Stack>
              </FormControl>
              {team.users.items.map((user, index) => (
                <Stack
                  key={index}
                  direction="row"
                  align="center"
                  mt={4}
                  justify="space-between"
                >
                  <Stack align="center" direction="row">
                    <Avatar
                      src={
                        user.avatar
                          ? user.avatar.downloadUrl
                          : "https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
                      }
                      backgroundColor="transparent"
                      icon={<FallbackIcon color={`mode.${colorMode}.icon`} />}
                      name={`${session.user.name}'s uploaded avatar`}
                      h={8}
                      w={8}
                      borderRadius="sm"
                    />
                    <Text color={`mode.${colorMode}.text`}>{user.email}</Text>
                  </Stack>
                  <Text fontStyle="italic" color={`mode.${colorMode}.tertiary`}>
                    {user.status}
                  </Text>
                </Stack>
              ))}
            </Card>
            <Box gridArea="1 / 2 / 3 / 4">
              <Grid templateColumns="repeat(2, 1fr)" gap={8}>
                {team.project.items.map((project, index) => (
                  <Card
                    session={session}
                    key={index}
                    link={`/${team.name}/${project.name}`}
                    linkLabel={`Links to ${team.name}'s project ${project.name}`}
                  >
                    <Stack spacing={2}>
                      <Flex align="center" justify="space-between">
                        <Text
                          color={`mode.${colorMode}.text`}
                          lineHeight="none"
                        >
                          {project.repository.owner}
                        </Text>
                        {project.configuration && (
                          <Code
                            colorScheme="cyan"
                            fontWeight={700}
                            borderRadius="sm"
                          >
                            configured
                          </Code>
                        )}
                      </Flex>
                      <Heading
                        as="h3"
                        lineHeight="none"
                        fontSize="md"
                        fontWeight={900}
                      >
                        {project.name}
                      </Heading>
                    </Stack>
                  </Card>
                ))}

                {/* Import a project | BUTTON */}
                <Button
                  onClick={mixpanelize(
                    session,
                    "Clicked a button",
                    {
                      to: `https://app.meeshkan.com/${team.name}/{newProject}`,
                      from: `https://app.meeshkan.com/${team.name}`,
                      c2a: "Import a project",
                    },
                    onOpen
                  )}
                  pos="unset"
                  p={4}
                  minH="72px"
                  justifyContent="start"
                  bg={`mode.${colorMode}.card`}
                  color={`mode.${colorMode}.title`}
                  _hover={{ color: `mode.${colorMode}.titleHover` }}
                >
                  <AddIcon boxSize={10} mr={2} stroke="2px" />
                  Import a project
                </Button>

                {/* Import a project | MODAL */}
                <Modal
                  onClose={onClose}
                  isOpen={isOpen}
                  isCentered
                  scrollBehavior={
                    E.isLeft(repoListAndThunk[0]) ? "outside" : "inside"
                  }
                  closeOnOverlayClick={true}
                  size="lg"
                >
                  <ModalOverlay>
                    <ModalContent
                      borderRadius="sm"
                      backgroundColor={`mode.${colorMode}.card`}
                    >
                      <ModalHeader
                        borderBottom="1px solid"
                        borderColor={`mode.${colorMode}.icon`}
                        mx={4}
                        px={0}
                        pt={4}
                        pb={2}
                        fontWeight={900}
                        color={`mode.${colorMode}.title`}
                      >
                        Import a project to {team.name}'s Team
                      </ModalHeader>
                      <ModalCloseButton
                        borderRadius="sm"
                        size="sm"
                        mt={2}
                        mr={0}
                        color={`mode.${colorMode}.text`}
                      />
                      <ModalBody px={2}>
                        {importProjectIsExecuting[0] ? (
                          <Box
                            h="100%"
                            w="100%"
                            d="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Spinner
                              color={
                                colorMode === "light" ? "red.500" : "red.300"
                              }
                              size="xl"
                              thickness="4px"
                              emptyColor={`mode.${colorMode}.icon`}
                            />
                          </Box>
                        ) : E.isRight(repoListAndThunk[0]) &&
                          E.isLeft(repoListAndThunk[0].right) ? (
                          <Flex h="100%" justify="center" align="center">
                            <Button
                              as="a"
                              colorScheme="red"
                              onClick={mixpanelize(
                                session,
                                "Clicked a button",
                                {
                                  to: `https://github.com/apps/meeshkan/installations/new`,
                                  from: `https://app.meeshkan.com/${team.name}`,
                                  c2a: "Import a project",
                                },
                                () =>
                                  ReactGA.event({
                                    category: "Github",
                                    action: "Import repo start",
                                    label: "index.tsx",
                                  })
                              )}
                              href={`https://github.com/apps/meeshkan/installations/new?state=${ghOauthState}`}
                              aria-label="Link to GitHub to install meeshkan on a repository"
                            >
                              <GithubIcon mr={2} />
                              Import from GitHub
                            </Button>
                          </Flex>
                        ) : E.isRight(repoListAndThunk[0]) &&
                          E.isRight(repoListAndThunk[0].right) &&
                          E.isRight(owner) &&
                          E.isRight(owner.right) &&
                          O.isSome(owner.right.right) ? (
                          <>
                            <Menu closeOnSelect={true} placement="bottom-start">
                              <MenuButton
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                minWidth="204px"
                                ml={2}
                                mb={4}
                                border="1px solid"
                                backgroundColor={`mode.${colorMode}.background`}
                                borderColor={`mode.${colorMode}.icon`}
                                p={0}
                                size="sm"
                                overflow="hidden"
                              >
                                <Avatar
                                  src={owner.right.right.value.avatar_url}
                                  backgroundColor="transparent"
                                  icon={
                                    <FallbackIcon
                                      color={`mode.${colorMode}.icon`}
                                    />
                                  }
                                  name={session.user.name}
                                  h={8}
                                  w={8}
                                  borderRadius="sm"
                                />
                                <Text mr={8} color={`mode.${colorMode}.text`}>
                                  {owner.right.right.value.login}
                                </Text>
                                <ArrowUpDownIcon
                                  boxSize="12px"
                                  color="gray.500"
                                  mr={2}
                                />
                              </MenuButton>
                              <MenuList
                                border="none"
                                backgroundColor={`mode.${colorMode}.card`}
                                color={`mode.${colorMode}.text`}
                              >
                                <MenuOptionGroup
                                  defaultValue={owner.right.right.value.login}
                                  type="radio"
                                >
                                  {repoListAndThunk[0].right.right.map(
                                    (reposForOwner, index) => (
                                      <MenuItemOption
                                        key={index}
                                        value={
                                          NEA.head(reposForOwner).owner.login
                                        }
                                        onClick={() => {
                                          setOwner(
                                            E.right(
                                              E.right(
                                                O.some(
                                                  NEA.head(reposForOwner).owner
                                                )
                                              )
                                            )
                                          );
                                          setOwnerRepos(
                                            E.right(
                                              E.right(O.some(reposForOwner))
                                            )
                                          );
                                        }}
                                      >
                                        {NEA.head(reposForOwner).owner.login}
                                      </MenuItemOption>
                                    )
                                  )}
                                </MenuOptionGroup>
                              </MenuList>
                            </Menu>
                            <Stack>
                              {E.isRight(ownerRepos) &&
                                E.isRight(ownerRepos.right) &&
                                O.isSome(ownerRepos.right.right) &&
                                ownerRepos.right.right.value
                                  .filter(
                                    (i) =>
                                      team.project.items
                                        .map((proj) => proj.name)
                                        .indexOf(i.name) === -1
                                  )
                                  .map((repo, index) => (
                                    <ImportProject
                                      key={index}
                                      teamName={team.name}
                                      session={session}
                                      repoName={repo.name}
                                      onClick={createProject({
                                        importProjectIsExecuting:
                                          importProjectIsExecuting[1],
                                        closeModal: onClose,
                                        toast,
                                        userId: getUserIdFromIdOrEnv(id),
                                        namePlusTeam: `${repo.name}${SEPARATOR}${team.name}`,
                                        nodeID: repo.node_id,
                                        nodePlusTeam:
                                          repo.node_id + SEPARATOR + team.id,
                                        repositoryName: repo.name,
                                        owner: repo.owner.login,
                                        // this assumes that at least one team exist
                                        // doesn't cover error case
                                        // where team addition fails
                                        teamName: team.name,
                                        router,
                                      })(session)}
                                    />
                                  ))}
                            </Stack>
                          </>
                        ) : (
                          E.isLeft(repoListAndThunk[0]) && (
                            <Box
                              h="100%"
                              w="100%"
                              d="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Spinner
                                color={
                                  colorMode === "light" ? "red.500" : "red.300"
                                }
                                size="xl"
                                thickness="4px"
                                emptyColor={`mode.${colorMode}.icon`}
                              />
                            </Box>
                          )
                        )}
                      </ModalBody>
                      <ModalFooter
                        d="flex"
                        justifyContent="center"
                        fontSize="sm"
                      >
                        {E.isRight(repoListAndThunk[0]) &&
                          !E.isLeft(repoListAndThunk[0].right) && (
                            <>
                              <Text mr={2} color={`mode.${colorMode}.text`}>
                                Not seeing the repository you want?
                              </Text>
                              <ChakraLink
                                href={`https://github.com/apps/meeshkan/installations/new?state=${ghOauthState}`}
                                aria-label="Link to GitHub to install meeshkan on a repository"
                              >
                                Configure on GitHub.
                              </ChakraLink>
                            </>
                          )}
                      </ModalFooter>
                    </ModalContent>
                  </ModalOverlay>
                </Modal>
              </Grid>
            </Box>
          </Grid>
        </>
      )
    )
);
