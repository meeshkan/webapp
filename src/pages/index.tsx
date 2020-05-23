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
import Card from "../components/molecules/card";
import ErrorComponent from "../components/molecules/error";
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
import { confirmOrCreateUser } from "../utils/user";
import { withSession } from "./api/session";

interface ImportProjectVariables {
  userId: string;
  teamName: string;
  closeModal: () => void;
  repositoryName: string;
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

export type ITeamsProps = { session: ISession; teams: ITeam[]; id: string };

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
          E.right({ _: closeModal(), __: importProjectIsExecuting(false) }._)
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
    RTE.chain(({ id }) =>
      pipe(
        getTeams,
        RTE.chain((teams) => RTE.right({ teams, id }))
      )
    ),
    RTE.chain(({ teams, id }) => (session) => TE.right({ session, teams, id })),
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

export default E.fold<GET_SERVER_SIDE_PROPS_ERROR, ITeamsProps, JSX.Element>(
  () => (
    <ErrorComponent
      errorMessage={
        "Meeshkan is temporarily offline. We are aware of the problem and are working hard to resolve it. For online support, please contact us using the Itercom icon below."
      }
    />
  ),
  ({ session, teams, id }) =>
    pipe(
      {
        useColorMode: useColorMode(),
        router: useRouter(),
        useDisclosure: useDisclosure(),
        teamsFromClientSideFetch: useTeams(session),
        stateForLogin: `{"env":"${process.env.GITHUB_AUTH_ENV}","id":"${session.user.sub}"}`,
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
        repoListAndThunk,
        allTeams,
        router,
        teamsFromClientSideFetch,
        importProjectIsExecuting,
        toast,
        useColorMode: { colorMode },
        useDisclosure: { onOpen, isOpen, onClose },
        stateForLogin,
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
            gap={6}
          >
            {teamsToProjects(allTeams).map(
              ({ teamName, teamImage, projectName }, index) => (
                <Card
                  key={index}
                  link={`/${teamName}/${projectName}`}
                  linkLabel={`Links to ${teamName}'s project ${projectName}`}
                >
                  <Stack spacing={4} isInline>
                    <Image
                      size={10}
                      src={teamImage}
                      alt={`${teamName}'s organization image`}
                      bg="gray.50"
                      border="1px solid"
                      borderColor={`mode.${colorMode}.icon`}
                      rounded="sm"
                    />
                    <Stack spacing={2}>
                      <Text color={`mode.${colorMode}.text`} lineHeight="none">
                        {teamName}
                      </Text>
                      <Heading
                        as="h3"
                        lineHeight="none"
                        fontSize="md"
                        fontWeight={900}
                      >
                        {projectName}
                      </Heading>
                    </Stack>
                  </Stack>
                </Card>
              )
            )}

            {/* Import a project | BUTTON */}
            <Button
              onClick={onOpen}
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
              Import a project
            </Button>

            {/* Import a project | MODAL */}
            <Modal
              onClose={onClose}
              isOpen={isOpen}
              isCentered
              scrollBehavior="inside"
              closeOnOverlayClick={true}
              size="lg"
            >
              <Skeleton isLoaded={!E.isLeft(repoListAndThunk[0])}>
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
                    Import a project to {allTeams[0].name}'s Team
                  </ModalHeader>
                  <ModalCloseButton
                    rounded="sm"
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
                          color={colorMode === "light" ? "red.500" : "red.300"}
                          size="xl"
                          thickness="4px"
                          emptyColor={`mode.${colorMode}.icon`}
                        />
                      </Box>
                    ) : E.isRight(repoListAndThunk[0]) &&
                      E.isLeft(repoListAndThunk[0].right) ? (
                      <Flex h="100%" justify="center" align="center">
                        <Button
                          as={"a"}
                          rounded="sm"
                          fontWeight={900}
                          px={4}
                          variantColor="red"
                          // @ts-ignore
                          href={`https://github.com/apps/meeshkan/installations/new?state=${stateForLogin}`}
                          aria-label="Link to GitHub to install meeshkan on a repository"
                        >
                          <Icon name="github" mr={2} />
                          Import from GitHub
                        </Button>
                      </Flex>
                    ) : (
                      E.isRight(repoListAndThunk[0]) &&
                      E.isRight(repoListAndThunk[0].right) &&
                      E.isRight(owner) &&
                      E.isRight(owner.right) &&
                      O.isSome(owner.right.right) && (
                        <>
                          <Menu closeOnSelect={true}>
                            <MenuButton
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              minWidth="204px"
                              rounded="sm"
                              ml={2}
                              mb={4}
                              border="1px solid"
                              backgroundColor={`mode.${colorMode}.background`}
                              borderColor={`mode.${colorMode}.icon`}
                            >
                              <Image
                                src={owner.right.right.value.avatar_url}
                                size={8}
                                roundedLeft="sm"
                                borderColor={`mode.${colorMode}.background`}
                              />
                              <Text mr={8} color={`mode.${colorMode}.text`}>
                                {owner.right.right.value.login}
                              </Text>
                              <Icon
                                name="arrow-up-down"
                                size="12px"
                                color="gray.500"
                                mr={2}
                              />
                            </MenuButton>
                            <MenuList
                              border="none"
                              placement="bottom-start"
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
                              ownerRepos.right.right.value.map(
                                (repo, index) => (
                                  <ImportProject
                                    key={index}
                                    repoName={repo.name}
                                    onClick={createProject({
                                      importProjectIsExecuting:
                                        importProjectIsExecuting[1],
                                      closeModal: onClose,
                                      toast,
                                      userId: id,
                                      namePlusTeam: `${repo.name}${SEPARATOR}${allTeams[0].name}`,
                                      nodeID: repo.node_id,
                                      nodePlusTeam:
                                        repo.node_id +
                                        SEPARATOR +
                                        allTeams[0].id,
                                      repositoryName: repo.name,
                                      // this assumes that at least one team exist
                                      // doesn't cover error case
                                      // where team addition fails
                                      // also does not allow multiple teams
                                      teamName: allTeams[0].name,
                                      setTeams: teamsFromClientSideFetch[2],
                                      router,
                                    })(session)}
                                  />
                                )
                              )}
                          </Stack>
                        </>
                      )
                    )}
                  </ModalBody>
                  <ModalFooter d="flex" justifyContent="center" fontSize="sm">
                    {E.isRight(repoListAndThunk[0]) &&
                      !E.isLeft(repoListAndThunk[0].right) && (
                        <>
                          <Text mr={2} color={`mode.${colorMode}.text`}>
                            Not seeing the repository you want?
                          </Text>
                          <ChakraLink
                            href={`https://github.com/apps/meeshkan/installations/new?state=${stateForLogin}`}
                            aria-label="Link to GitHub to install meeshkan on a repository"
                            color={colorMode == "light" ? "red.500" : "red.200"}
                          >
                            Configure on GitHub.
                          </ChakraLink>
                        </>
                      )}
                  </ModalFooter>
                </ModalContent>
              </Skeleton>
            </Modal>
          </Grid>
        </>
      )
    )
);
