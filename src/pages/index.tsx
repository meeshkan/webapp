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
} from "@chakra-ui/core";
import { GraphQLClient } from "graphql-request";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { Either, isLeft, isRight, left, right } from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { groupSort, NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { chain, isSome, Option, some } from "fp-ts/lib/Option";
import { Ord, ordString } from "fp-ts/lib/Ord";
import { pipe } from "fp-ts/lib/pipeable";
import { head } from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as TE from "fp-ts/lib/TaskEither";
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
  INTERNAL_REST_ENDPOINT_ERROR,
  IOwner,
  IRepository,
  NEEDS_REAUTH,
  NegativeGithubFetchOutcome,
  OAUTH_FLOW_ERROR,
  PARSING_ERROR as GH_PARSING_ERROR,
  Repository,
  UNDEFINED_ERROR as GH_UNDEFINED_ERROR,
} from "../utils/gh";
import { hookNeedingFetch, Loading } from "../utils/hookNeedingFetch";
import {
  getTeams,
  NOT_LOGGED_IN,
  teamsToProjects,
  UNDEFINED_ERROR,
  useTeams,
  ITeam,
  NegativeTeamsFetchOutcome,
} from "../utils/teams";
import { confirmOrCreateUser } from "../utils/user";

interface ImportProjectVariables {
  userId: string;
  teamName: string;
  repositoryName: string;
  nodeID: string;
  nodePlusTeam: string;
  namePlusTeam: string;
}

interface IMPORT_PROJECT_UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
}

type NegativeOutcomeImportProject = IMPORT_PROJECT_UNDEFINED_ERROR;

const IMPORT_PROJECT_UNDEFINED_ERROR = (): NegativeOutcomeImportProject => ({
  type: "UNDEFINED_ERROR",
});

export type ITeamsProps = { session: ISession; teams: ITeam[]; id: string };

const createProject = (importProjectVariables: ImportProjectVariables) => (
  session: ISession
): TE.TaskEither<NegativeOutcomeImportProject, any> =>
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
        }
      }`,
          importProjectVariables
        ),
      IMPORT_PROJECT_UNDEFINED_ERROR
    ),
    (resultOfNetworkCall) => {
      console.log(resultOfNetworkCall);
      return resultOfNetworkCall;
    }
  );

const userType = t.type({ id: t.string });
export const getServerSideProps = ({ req }): Promise<{ props: ITeamsProps }> =>
  pipe(
    TE.tryCatch(() => auth0().getSession(req), NOT_LOGGED_IN),
    TE.chain(_TE.fromNullable(NOT_LOGGED_IN())),
    TE.chain(
      pipe(
        _RTE.tryToEitherCatch(
          confirmOrCreateUser("id", userType),
          UNDEFINED_ERROR
        ),
        RTE.chain(({ id }) =>
          pipe(
            _RTE.tryToEitherCatch(getTeams, UNDEFINED_ERROR),
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
  onClick: TE.TaskEither<NegativeOutcomeImportProject, void>;
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
  owner: Either<"Loading", Either<NegativeGithubFetchOutcome, Option<IOwner>>>,
  setOwner: React.Dispatch<
    React.SetStateAction<
      Either<"Loading", Either<NegativeGithubFetchOutcome, Option<IOwner>>>
    >
  >,
  setOwnerRepos: React.Dispatch<
    React.SetStateAction<
      Either<
        "Loading",
        Either<NegativeGithubFetchOutcome, Option<NonEmptyArray<IRepository>>>
      >
    >
  >
) =>
  hookNeedingFetch<
    Either<NegativeGithubFetchOutcome, IRepositoriesGroupedByOwner>
  >(
    pipe(
      TE.tryCatch(() => fetch("/api/gh/repos"), GH_UNDEFINED_ERROR),
      TE.chain((res) =>
        res.ok
          ? TE.tryCatch(() => res.json(), GH_UNDEFINED_ERROR)
          : TE.left(INTERNAL_REST_ENDPOINT_ERROR())
      ),
      TE.chain(
        flow(
          t.array(Repository).decode,
          E.mapLeft(GH_PARSING_ERROR),
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
      newProps: useTeams(session),
      stateForLogin: `{"env":"${process.env.GITHUB_AUTH_ENV}","id":"${session.user.sub}"}`,
      useOwner: useState(
        left(Loading) as Either<
          Loading,
          Either<NegativeGithubFetchOutcome, Option<IOwner>>
        >
      ),
      useOwnerRepos: useState(
        left<
          Loading,
          Either<NegativeGithubFetchOutcome, Option<NonEmptyArray<IRepository>>>
        >(Loading)
      ),
    },
    (p) => ({
      ...p,
      allTeams:
        isRight(p.newProps) && isRight(p.newProps.right)
          ? p.newProps.right.right
          : teams,
      repoList: useRepoList(p.useOwner[0], p.useOwner[1], p.useOwnerRepos[1]),
    }),
    ({
      repoList,
      allTeams,
      useColorMode: { colorMode },
      useDisclosure: { onOpen, isOpen, onClose },
      stateForLogin,
      useOwner: [owner, setOwner],
      useOwnerRepos: [ownerRepos, setOwnerRepos],
    }) =>
      isRight(repoList) &&
      isLeft(repoList.right) &&
      pipe(repoList.right.left, (err) =>
        [
          INTERNAL_REST_ENDPOINT_ERROR(),
          NEEDS_REAUTH(),
          OAUTH_FLOW_ERROR(),
        ].reduce(
          (a, b) => a || eqNegativeGithubFetchOutcome.equals(err, b),
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
              <Skeleton isLoaded={!isLeft(repoList)}>
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
                    {isRight(repoList) && isLeft(repoList.right) ? (
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
                      isRight(repoList) &&
                      isRight(repoList.right) &&
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
                                {repoList.right.right.map(
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
                    {isRight(repoList) && (
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
