import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spinner,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
  useToastOptions,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/core";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { constant, flow } from "fp-ts/lib/function";
import { groupSort, NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import * as O from "fp-ts/lib/Option";
import * as Ord from "fp-ts/lib/Ord";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { NextRouter, useRouter } from "next/router";
import React, { useState } from "react";
import ReactGA from "react-ga";
import Card from "../components/molecules/card";
import { withError } from "../components/molecules/error";
import * as _E from "../fp-ts/Either";
import { CREATE_PROJECT_MUTATION } from "../gql/pages";
import {
  GET_SERVER_SIDE_PROPS_ERROR,
  INCORRECT_TYPE_SAFETY,
  UNDEFINED_ERROR,
} from "../utils/error";
import {
  IOwner,
  IRepository,
  NegativeGithubFetchOutcome,
  Repository,
} from "../utils/gh";
import { eightBaseClient } from "../utils/graphql";
import {
  hookNeedingFetch,
  InitialLoading,
  Loading,
} from "../utils/hookNeedingFetch";
import { SEPARATOR } from "../utils/separator";
import {
  getTeams,
  ITeam,
  NegativeTeamsFetchOutcome,
  Team,
  teamsToProjects,
  useTeams,
} from "../utils/teams";
import { confirmOrCreateUser, getUserIdFromIdOrEnv } from "../utils/user";
import { withSession } from "./api/session";
import { getGHOAuthState } from "../utils/oauth";

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
  toast: (props: useToastOptions) => void;
  setTeams: React.Dispatch<
    React.SetStateAction<
      E.Either<Loading, E.Either<NegativeTeamsFetchOutcome, ITeam[]>>
    >
  >;
}

const teamsMutationType = t.type({
  userUpdate: t.type({
    team: t.type({
      items: t.array(Team),
    }),
  }),
});

type TeamsMutationType = t.TypeOf<typeof teamsMutationType>;

type NegativeImportProjectOutcome = UNDEFINED_ERROR | INCORRECT_TYPE_SAFETY;

export type ITeamsProps = {
  session: ISession;
  teams: ITeam[];
  id: string;
  ghOauthState: string;
};

const createProject = ({
  setTeams,
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
        TE.chainEitherK<NegativeImportProjectOutcome, any, TeamsMutationType>(
          flow(
            teamsMutationType.decode,
            E.mapLeft(
              (errors): NegativeImportProjectOutcome => ({
                type: "INCORRECT_TYPE_SAFETY",
                msg:
                  "Teams list from gql endpoint does not match type definition",
                errors,
              })
            )
          )
        ),
        TE.chain(({ userUpdate: { team: { items } } }) =>
          TE.right(setTeams(E.right(E.right(items))))
        ),
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

const userType = t.type({ id: t.string });
export const getServerSideProps = ({
  req,
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, ITeamsProps>;
}> =>
  pipe(
    confirmOrCreateUser("id", userType),
    RTE.chain((p) =>
      pipe(
        getTeams,
        RTE.chain((teams) => RTE.right({ teams, ...p }))
      )
    ),
    RTE.chain((p) =>
      pipe(
        getGHOAuthState,
        RTE.fromReaderEither,
        RTE.chain((ghOauthState) => RTE.right({ ghOauthState, ...p }))
      )
    ),
    RTE.chain((p) => (session) => TE.right({ session, ...p })),
    withSession(req, "index.tsx getServerSideProps")
  )().then(_E.eitherSanitizedWithGenericError);

type IRepositoriesGroupedByOwner = NonEmptyArray<IRepository>[];

type ImportProps = {
  repoName: String;
  onClick: TE.TaskEither<NegativeImportProjectOutcome, void>;
};

const ImportProject = ({ repoName, onClick }: ImportProps) => {
  const { colorMode } = useColorMode();
  return (
    <Button
      w="full"
      variant="ghost"
      rounded="sm"
      onClick={() => onClick()}
      justifyContent="space-between"
      color={`mode.${colorMode}.text`}
    >
      <Flex align="center">
        <Icon name="github" mr={2} />
        <Text>{repoName}</Text>
      </Flex>
      <Icon name="chevron-right" />
    </Button>
  );
};

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

export default withError<GET_SERVER_SIDE_PROPS_ERROR, ITeamsProps>(
  "Meeshkan is temporarily offline. We are aware of the problem and are working hard to resolve it. Please check back soon!",
  ({ session, teams, id, ghOauthState }) =>
    pipe(
      {
        useColorMode: useColorMode(),
        router: useRouter(),
        useDisclosure: useDisclosure(),
        teamsFromClientSideFetch: useTeams(session),
        useOwner: useState<
          E.Either<
            Loading,
            E.Either<NegativeGithubFetchOutcome, O.Option<IOwner>>
          >
        >(E.left(InitialLoading)),
        importProjectIsExecuting: React.useState(false),
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
      },
      (p) => ({
        ...p,
        allTeams:
          E.isRight(p.teamsFromClientSideFetch[0]) &&
          E.isRight(p.teamsFromClientSideFetch[0].right)
            ? p.teamsFromClientSideFetch[0].right.right
            : teams,
        repoListAndThunk: useRepoList(
          p.useOwner[0],
          p.useOwner[1],
          p.useOwnerRepos[1]
        ),
      }),
      ({
        allTeams,
        toast,
        useColorMode: { colorMode },
        useDisclosure: { onOpen, isOpen, onClose },
        useOwner: [owner, setOwner],
        useOwnerRepos: [ownerRepos, setOwnerRepos],
      }) => (
        <>
          <Grid
            templateColumns={[
              "repeat(2, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
            ]}
            gap={8}
          >
            {allTeams.map((team, index) => (
              <Card
                key={index}
                link={`/${team.name}/`}
                linkLabel={`Links to ${team.name}'s dashboard`}
              >
                <Stack spacing={4} isInline>
                  <Image
                    size={10}
                    src={
                      team.image
                        ? team.image.downloadUrl
                        : "https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
                    }
                    alt={`${team.name}'s organization image`}
                    bg="gray.50"
                    border="1px solid"
                    borderColor={`mode.${colorMode}.icon`}
                    rounded="sm"
                  />
                  <Stack spacing={2}>
                    <Heading
                      as="h3"
                      lineHeight="none"
                      fontSize="md"
                      fontWeight={900}
                    >
                      {team.name}
                    </Heading>
                    <Text color={`mode.${colorMode}.text`} lineHeight="none">
                      {`${team.project.items.length} projects`}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            ))}

            {/* Create a team | BUTTON */}
            <Button
              onClick={onOpen}
              pos="unset"
              p={4}
              minH="72px"
              justifyContent="start"
              rounded="sm"
              lineHeight="none"
              fontSize="md"
              fontWeight={900}
              bg={`mode.${colorMode}.card`}
              color={`mode.${colorMode}.title`}
              _hover={{ color: `mode.${colorMode}.titleHover` }}
            >
              <Icon h={10} w={10} mr={2} name="add" stroke="2px" />
              Create a team
            </Button>
          </Grid>

          {/* Create a team | MODAL */}
          <Modal
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            scrollBehavior="inside"
            closeOnOverlayClick={true}
            size="lg"
          >
            <ModalOverlay />
            <ModalContent
              rounded="sm"
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
                Create a team
              </ModalHeader>
              <ModalCloseButton
                rounded="sm"
                size="sm"
                mt={2}
                mr={0}
                color={`mode.${colorMode}.text`}
              />
              <ModalBody px={2}>
                <FormControl isRequired>
                  <FormLabel>Team name</FormLabel>
                  <Input />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button>Create</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    )
);
