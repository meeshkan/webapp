import {
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
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
  Spinner,
  useToastOptions,
  Box,
} from "@chakra-ui/core";
import { GraphQLClient } from "graphql-request";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { Either, isLeft, isRight, left, right } from "fp-ts/lib/Either";
import { flow, constant } from "fp-ts/lib/function";
import { groupSort, NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { chain, isSome, Option, some } from "fp-ts/lib/Option";
import { Ord, ordString } from "fp-ts/lib/Ord";
import { pipe } from "fp-ts/lib/pipeable";
import { head } from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as t from "io-ts";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import React, { useState } from "react";
import VerifyLogin from "../components/Dashboard/verify-login";
// import { useRouter } from "next/router";
import Card from "../components/molecules/card";
import * as _E from "../fp-ts/Either";
import * as _RTE from "../fp-ts/ReaderTaskEither";
import * as _TE from "../fp-ts/TaskEither";
import auth0 from "../utils/auth0";
import {
  eqNegativeGithubFetchOutcome,
  IOwner,
  IRepository,
  NegativeGithubFetchOutcome,
  Repository,
} from "../utils/gh";
import {
  hookNeedingFetch,
  Loading,
  InitialLoading,
} from "../utils/hookNeedingFetch";
import {
  getTeams,
  teamsToProjects,
  useTeams,
  ITeam,
  NegativeTeamsFetchOutcome,
  Team,
} from "../utils/teams";
import { confirmOrCreateUser } from "../utils/user";
import { UNDEFINED_ERROR, INCORRECT_TYPE_SAFETY } from "../utils/error";

interface ImportProjectVariables {
  userId: string;
  teamName: string;
  closeModal: () => void;
  repositoryName: string;
  nodeID: string;
  nodePlusTeam: string;
  namePlusTeam: string;
  importProjectIsExecuting: React.Dispatch<React.SetStateAction<boolean>>;
  toast: (props: useToastOptions) => void;
  setTeams: React.Dispatch<
    React.SetStateAction<
      Either<Loading, Either<NegativeTeamsFetchOutcome, ITeam[]>>
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
            new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
              headers: {
                authorization: `Bearer ${session.idToken}`,
              },
            }).request(
              `mutation CREATE_PROJECT($userId:ID!, $teamName:String!, $repositoryName: String!, $namePlusTeam: String!, $nodePlusTeam: String!, $nodeID: String!) {
        userUpdate(filter: {
          id: $userId
        },
        data:{
          team: {
            update: {
              filter:{
                name:$teamName
              }
              data:{
                project: {
                  create: {
                    name: $repositoryName
                    namePlusTeamName: $namePlusTeam
                    repository: {
                      create:{
                        name: $repositoryName
                        nodeId: $nodeID
                        nodeIdPlusTeamId:$nodePlusTeam
                      }
                    }
                  }
                }
              }
            }
          }
        }) {
          id
          team {
            items{
              name
              id
              image {
                downloadUrl
              }
              project {
                items {
                  name
                  repository {
                      nodeId
                  }
                }
              }
            }
          }
        }
      }`,
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
      Promise.resolve(
        E.right({ _: closeModal(), __: importProjectIsExecuting(false) }._)
      )
  );

const userType = t.type({ id: t.string });
export const getServerSideProps = ({ req }): Promise<{ props: ITeamsProps }> =>
  pipe(
    TE.tryCatch(
      () => auth0().getSession(req),
      (error) => ({
        type: "UNDEFINED_ERROR",
        msg: "Could not get session in server side props",
        error,
      })
    ),
    TE.chain(
      _TE.fromNullable({
        type: "NOT_LOGGED_IN",
        msg: "Not logged in in server side props for index.tsx",
      })
    ),
    TE.chain(
      pipe(
        _RTE.tryToEitherCatch(
          confirmOrCreateUser("id", userType),
          (error): NegativeTeamsFetchOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Could not get session in index.tsx server side props",
            error,
          })
        ),
        RTE.chain(({ id }) =>
          pipe(
            _RTE.tryToEitherCatch(
              getTeams,
              (error): NegativeTeamsFetchOutcome => ({
                type: "UNDEFINED_ERROR",
                msg:
                  "Could not confirm or create user in index.tsx server side props",
                error,
              })
            ),
            RTE.chain((teams) => RTE.right({ teams, id }))
          )
        ),
        _RTE.chainEitherKWithAsk(({ teams, id }) => (session) =>
          E.right({ props: { session, teams, id } })
        )
      )
    )
  )().then(
    _E.eitherAsPromiseWithSwallowedError<
      NegativeTeamsFetchOutcome,
      { props: ITeamsProps }
    >({ props: { session: { user: {}, createdAt: 0 }, teams: [], id: "" } })
  );

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

const ordRepositoryByOwner: Ord<IRepository> = {
  compare: (repo0, repo1) =>
    ordString.compare(repo0.owner.login, repo1.owner.login),
  equals: (repo0, repo1) => repo0.owner.login === repo1.owner.login,
};

const groupReposByOwner = (repos: IRepository[]): IRepositoriesGroupedByOwner =>
  groupSort(ordRepositoryByOwner)(repos);

async function authorizeGithub() {
  // This is a placholder for the function that calls the GitHub API for what Meeshkan is installed on an returns an object currently represented by a variable called 'owners'. This includes the organizations with Meeshkan installed, and lists the specific repos below.
  return null;
}

const useRepoList = (
  owner: Either<Loading, Either<NegativeGithubFetchOutcome, Option<IOwner>>>,
  setOwner: React.Dispatch<
    React.SetStateAction<
      Either<Loading, Either<NegativeGithubFetchOutcome, Option<IOwner>>>
    >
  >,
  setOwnerRepos: React.Dispatch<
    React.SetStateAction<
      Either<
        Loading,
        Either<NegativeGithubFetchOutcome, Option<NonEmptyArray<IRepository>>>
      >
    >
  >
) =>
  hookNeedingFetch<
    Either<NegativeGithubFetchOutcome, IRepositoriesGroupedByOwner>
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
          isLeft(owner) || isLeft(owner.right)
            ? [
                setOwner(
                  right(
                    right(
                      pipe(
                        A.head(repos),
                        chain((repoList) => some(head(repoList).owner))
                      )
                    )
                  )
                ),
                setOwnerRepos(right(right(A.head(repos)))),
              ]
            : [],
          TE.right
        )
      )
    )
  );

export default ({ session, teams, id }: ITeamsProps) =>
  pipe(
    {
      useColorMode: useColorMode(),
      useDisclosure: useDisclosure(),
      teamsFromClientSideFetch: useTeams(session),
      stateForLogin: `{"env":"${process.env.GITHUB_AUTH_ENV}","id":"${session.user.sub}"}`,
      useOwner: useState(
        left(InitialLoading) as Either<
          Loading,
          Either<NegativeGithubFetchOutcome, Option<IOwner>>
        >
      ),
      importProjectIsExecuting: React.useState(false),
      useOwnerRepos: useState(
        left<
          Loading,
          Either<NegativeGithubFetchOutcome, Option<NonEmptyArray<IRepository>>>
        >(InitialLoading)
      ),
      toast: useToast(),
    },
    (p) => ({
      ...p,
      allTeams:
        isRight(p.teamsFromClientSideFetch[0]) &&
        isRight(p.teamsFromClientSideFetch[0].right)
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
      teamsFromClientSideFetch,
      importProjectIsExecuting,
      toast,
      useColorMode: { colorMode },
      useDisclosure: { onOpen, isOpen, onClose },
      stateForLogin,
      useOwner: [owner, setOwner],
      useOwnerRepos: [ownerRepos, setOwnerRepos],
    }) =>
      isRight(repoListAndThunk[0]) &&
      isLeft(repoListAndThunk[0].right) &&
      pipe(repoListAndThunk[0].right.left, (err) =>
        ["REST_ENDPOINT_ERROR", "NEEDS_REAUTH", "OAUTH_FLOW_ERROR"].reduce(
          (a, b) => a || b == err.type,
          false
        )
      ) ? (
        <VerifyLogin
          link={`https://github.com/login/oauth/authorize?client_id=${process.env.GH_OAUTH_APP_CLIENT_ID}&redirect_uri=https://app.meeshkan.com/api/gh/oauth-triage&state=${stateForLogin}`}
        />
      ) : (
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
                <Card key={index} link={`/${teamName}/${projectName}`}>
                  <Stack spacing={4} isInline>
                    <Image
                      size={10}
                      src={teamImage}
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
              <Skeleton isLoaded={!isLeft(repoListAndThunk[0])}>
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
                    {/* TODO make this team name dynamic */}
                    Import a project to Makenna’s Team
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
                    ) : isRight(repoListAndThunk[0]) &&
                      isLeft(repoListAndThunk[0].right) ? (
                      <Flex h="100%" justify="center" align="center">
                        <Button
                          rounded="sm"
                          fontWeight={900}
                          px={4}
                          variantColor="red"
                          onClick={(e) => {
                            e.preventDefault();
                            authorizeGithub();
                          }}
                        >
                          <Icon name="github" mr={2} />
                          Import from GitHub
                        </Button>
                      </Flex>
                    ) : (
                      isRight(repoListAndThunk[0]) &&
                      isRight(repoListAndThunk[0].right) &&
                      isRight(owner) &&
                      isRight(owner.right) &&
                      isSome(owner.right.right) && (
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
                                      value={head(reposForOwner).owner.login}
                                      onClick={() => {
                                        setOwner(
                                          right(
                                            right(
                                              some(head(reposForOwner).owner)
                                            )
                                          )
                                        );
                                        setOwnerRepos(
                                          right(right(some(reposForOwner)))
                                        );
                                      }}
                                    >
                                      {head(reposForOwner).owner.login}
                                    </MenuItemOption>
                                  )
                                )}
                              </MenuOptionGroup>
                            </MenuList>
                          </Menu>
                          <Stack>
                            {isRight(ownerRepos) &&
                              isRight(ownerRepos.right) &&
                              isSome(ownerRepos.right.right) &&
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
                                      namePlusTeam: `${repo.name}% [/!${allTeams[0].name}`,
                                      nodeID: repo.node_id,
                                      nodePlusTeam:
                                        repo.node_id + "% [/!" + allTeams[0].id,
                                      repositoryName: repo.name,
                                      // this assumes that at least one team exist
                                      // doesn't cover error case
                                      // where team addition fails
                                      // also does not allow multiple teams
                                      teamName: allTeams[0].name,
                                      setTeams: teamsFromClientSideFetch[2],
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
                    {isRight(repoListAndThunk[0]) && (
                      <>
                        <Text mr={2} color={`mode.${colorMode}.text`}>
                          Not seeing the repository you want?
                        </Text>
                        <ChakraLink
                          href={`https://github.com/apps/meeshkan/installations/new?state=${stateForLogin}`}
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
  );
