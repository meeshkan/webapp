import React, { useState } from "react";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import {
  Grid,
  Heading,
  Icon,
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
  Skeleton,
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
} from "@chakra-ui/core";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import Card from "../components/molecules/card";
import { withError } from "../components/molecules/error";
import * as _E from "../fp-ts/Either";
import { GET_TEAM_QUERY } from "../gql/pages/[teamName]";
import { LensTaskEither, lensTaskEitherHead } from "../monocle-ts";
import { useRouter } from "next/router";
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
import { withSession } from "./api/session";
import { getGHOAuthState } from "../utils/oauth";
import { SEPARATOR } from "../utils/separator";
import { useTeams } from "../utils/teams";
import ReactGA, { testModeAPI } from "react-ga";

type NegativeTeamFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | UNKNOWN_GRAPHQL_ERROR
  | INCORRECT_TYPE_SAFETY
  | INCORRECT_TYPE_SAFETY;

const Team = t.type({
  image: t.union([
    t.null,
    t.type({
      downloadUrl: t.string,
    }),
  ]),
  inviteLink: t.string,
  name: t.string,
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
        repository: t.union([
          t.null,
          t.type({
            owner: t.string,
          }),
        ]),
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

type ITeam = t.TypeOf<typeof Team>;
const queryTp = t.type({
  user: t.type({
    team: t.type({
      items: t.array(Team),
    }),
  }),
});

type QueryTp = t.TypeOf<typeof queryTp>;

const getTeam = (teamName: string) => (
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
            msg: "Could not decode team name query",
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

type ITeamProps = { team: ITeam; session: ISession; ghOauthState: string };

const userType = t.type({ id: t.string });

export const getServerSideProps = ({
  params: { teamName },
  req,
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, ITeamProps>;
}> =>
  pipe(
    confirmOrCreateUser("id", userType),
    RTE.chain((_) => getTeam(teamName)),
    RTE.chain((team) =>
      pipe(
        getGHOAuthState,
        RTE.fromReaderEither,
        RTE.chain((ghOauthState) => RTE.right({ ghOauthState, team }))
      )
    ),
    RTE.chain((p) => (session) => TE.right({ session, ...p })),
    withSession(req, "[teamName].tsx getServerSideProps")
  )().then(_E.eitherSanitizedWithGenericError);

export default withError<GET_SERVER_SIDE_PROPS_ERROR, ITeamProps>(
  "Uh oh. Looks like this resource does not exist.",
  ({ team, session, ghOauthState }) =>
    pipe(
      {
        useColorMode: useColorMode(),
        router: useRouter(),
        useDisclosure: useDisclosure(),
        teamsFromClientSideFetch: useTeams(session),
        useClipboard: useClipboard(team.inviteLink),
        // useOwner: useState<
        //   E.Either<
        //     Loading,
        //     E.Either<NegativeGithubFetchOutcome, O.Option<IOwner>>
        //   >
        // >(E.left(InitialLoading)),
        // importProjectIsExecuting: React.useState(false),
        // useOwnerRepos: useState<
        //   E.Either<
        //     Loading,
        //     E.Either<
        //       NegativeGithubFetchOutcome,
        //       O.Option<NonEmptyArray<IRepository>>
        //     >
        //   >
        // >(E.left(InitialLoading)),
        toast: useToast(),
      },
      (p) => ({
        ...p,
        // allTeams:
        //   E.isRight(p.teamsFromClientSideFetch[0]) &&
        //   E.isRight(p.teamsFromClientSideFetch[0].right)
        //     ? p.teamsFromClientSideFetch[0].right.right
        //     : teams,
        // repoListAndThunk: useRepoList(
        //   p.useOwner[0],
        //   p.useOwner[1],
        //   p.useOwnerRepos[1]
        // ),
      }),
      ({
        // repoListAndThunk,
        // allTeams,
        // router,
        // teamsFromClientSideFetch,
        // importProjectIsExecuting,
        // toast,
        useClipboard: { onCopy, hasCopied },
        useColorMode: { colorMode },
        useDisclosure: { onOpen, isOpen, onClose },
        // useOwner: [owner, setOwner],
        // useOwnerRepos: [ownerRepos, setOwnerRepos],
      }) => (
        <>
          <Grid
            templateColumns="repeat(3, 1fr)"
            templateRows="repeat(2, 1fr)"
            gap={8}
          >
            <Card gridArea="1 / 1 / 2 / 2" heading="Team settings">
              <Flex align="center" mt={4}>
                <Image
                  src={team.image && team.image.downloadUrl}
                  fallbackSrc="https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
                  size={8}
                  rounded="sm"
                  mr={4}
                />
                <Box>
                  <FormLabel
                    color={`mode.${colorMode}.text`}
                    fontSize="sm"
                    p="0 0 4px 0"
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
              <FormControl d="flex" mt={4}>
                <FormLabel color={`mode.${colorMode}.text`}>
                  Team Name:
                </FormLabel>
                <Text color={`mode.${colorMode}.title`} fontWeight={600}>
                  {team.name}
                </Text>
              </FormControl>
              <FormControl d="flex">
                <FormLabel color={`mode.${colorMode}.text`}>Plan:</FormLabel>
                <Text color={`mode.${colorMode}.title`} fontWeight={600}>
                  Free
                </Text>
              </FormControl>
            </Card>

            <Card
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
                <Stack isInline>
                  <Input
                    value={team.inviteLink}
                    isReadOnly
                    size="sm"
                    rounded="sm"
                  />
                  <Button
                    onClick={onCopy}
                    ml={2}
                    size="sm"
                    px={4}
                    rounded="sm"
                    fontWeight={900}
                    variantColor="blue"
                  >
                    {hasCopied ? "Copied" : "Copy"}
                  </Button>
                </Stack>
              </FormControl>
              {team.users.items.map((user, index) => (
                <Stack
                  key={index}
                  isInline
                  align="center"
                  mt={4}
                  justify="space-between"
                >
                  <Stack align="center" isInline>
                    <Image
                      src={
                        user.avatar
                          ? user.avatar.downloadUrl
                          : "https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
                      }
                      rounded="full"
                      size={8}
                      border="1px solid"
                      borderColor={`mode.${colorMode}.icon`}
                    />
                    <Text>{user.email}</Text>
                  </Stack>
                  <Text color="gray.500" fontStyle="italic">
                    {user.status}
                  </Text>
                </Stack>
              ))}
            </Card>
            <Box gridArea="1 / 2 / 3 / 4">
              <Grid templateColumns="repeat(2, 1fr)" gap={8}>
                {team.project.items.map((project, index) => (
                  <Card
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
                            variantColor="cyan"
                            fontWeight={700}
                            rounded="sm"
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
                      Import a project to {team.name}'s Team
                    </ModalHeader>
                    <ModalCloseButton
                      rounded="sm"
                      size="sm"
                      mt={2}
                      mr={0}
                      color={`mode.${colorMode}.text`}
                    />
                    <ModalBody px={2}>
                      {/* {importProjectIsExecuting[0] ? ( */}
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
                      {/* ) : E.isRight(repoListAndThunk[0]) && */}
                      {/* E.isLeft(repoListAndThunk[0].right) ? ( */}
                      <Flex h="100%" justify="center" align="center">
                        <Button
                          as={"a"}
                          rounded="sm"
                          fontWeight={900}
                          px={4}
                          variantColor="red"
                          onClick={() =>
                            ReactGA.event({
                              category: "Github",
                              action: "Import repo start",
                              label: "index.tsx",
                            })
                          }
                          // @ts-ignore
                          href={`https://github.com/apps/meeshkan/installations/new?state=${ghOauthState}`}
                          aria-label="Link to GitHub to install meeshkan on a repository"
                        >
                          <Icon name="github" mr={2} />
                          Import from GitHub
                        </Button>
                      </Flex>
                      {/* ) : (
                        E.isRight(repoListAndThunk[0]) &&
                        E.isRight(repoListAndThunk[0].right) &&
                        E.isRight(owner) &&
                        E.isRight(owner.right) &&
                        O.isSome(owner.right.right) && ( */}
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
                              src={
                                team.image
                                  ? team.image.downloadUrl
                                  : "https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
                              }
                              size={8}
                              roundedLeft="sm"
                              borderColor={`mode.${colorMode}.background`}
                            />
                            <Text mr={8} color={`mode.${colorMode}.text`}>
                              {team.name}
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
                              // defaultValue={owner.right.right.value.login}
                              type="radio"
                            >
                              {/* {repoListAndThunk[0].right.right.map(
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
                                  )} */}
                            </MenuOptionGroup>
                          </MenuList>
                        </Menu>
                        <Stack>
                          {/* {E.isRight(ownerRepos) &&
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
                                        userId: getUserIdFromIdOrEnv(id),
                                        namePlusTeam: `${repo.name}${SEPARATOR}${allTeams[0].name}`,
                                        nodeID: repo.node_id,
                                        nodePlusTeam:
                                          repo.node_id +
                                          SEPARATOR +
                                          allTeams[0].id,
                                        repositoryName: repo.name,
                                        owner: repo.owner.login,
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
                                )} */}
                        </Stack>
                      </>
                      {/* ) )} */}
                    </ModalBody>
                    <ModalFooter d="flex" justifyContent="center" fontSize="sm">
                      {/* {E.isRight(repoListAndThunk[0]) &&
                        !E.isLeft(repoListAndThunk[0].right) && (
                          <>
                            <Text mr={2} color={`mode.${colorMode}.text`}>
                              Not seeing the repository you want?
                            </Text>
                            <ChakraLink
                              href={`https://github.com/apps/meeshkan/installations/new?state=${ghOauthState}`}
                              aria-label="Link to GitHub to install meeshkan on a repository"
                              color={
                                colorMode == "light" ? "red.500" : "red.200"
                              }
                            >
                              Configure on GitHub.
                            </ChakraLink>
                          </>
                        )} */}
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Grid>
            </Box>
          </Grid>
        </>
      )
    )
);
