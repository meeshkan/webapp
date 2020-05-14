import React, { useState } from "react";
import {
  Stack,
  Text,
  Grid,
  Image,
  useColorMode,
  Heading,
  Icon,
  Link as ChakraLink,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Flex,
  Skeleton,
} from "@chakra-ui/core";
import auth0 from "../utils/auth0";
// import { useRouter } from "next/router";
import Card from "../components/molecules/card";
import { isLeft, isRight, left, Either, right } from "fp-ts/lib/Either";
import { Option, some, none, isSome } from "fp-ts/lib/Option";
import { groupSort, NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { Ord, ordString } from "fp-ts/lib/Ord";
import * as t from "io-ts";
import {
  IProjectsProps,
  NegativeProjectsFetchOutcome,
  getProjects,
  useProjects,
  teamsToProjects,
} from "../utils/projects";
import { confirmOrCreateUser } from "../utils/user";
import { hookNeedingFetch, Loading } from "../utils/hookNeedingFetch";
import { IRepository, IOwner } from "../utils/gh";
import { head } from "fp-ts/lib/ReadonlyNonEmptyArray";

type ImportProps = {
  repoName: String;
};

function createProject() {
  // This will execute the function that takes a repository and makes a project
  return null;
}

export async function getServerSideProps(
  context
): Promise<{ props: IProjectsProps }> {
  const { req } = context;
  const session = await auth0.getSession(req);
  if (!session) {
    return { props: left(NegativeProjectsFetchOutcome.NOT_LOGGED_IN) };
  }
  const tp = t.type({ id: t.string });
  const c = await confirmOrCreateUser<t.TypeOf<typeof tp>>(
    "id",
    session,
    tp.is
  );
  if (isLeft(c)) {
    console.error("type safety error in application");
  }
  const teams = await getProjects(session);

  return {
    props: teams,
  };
}

type IRepositoriesGroupedByOwner = NonEmptyArray<IRepository>[];
interface IProject {
  teamName: string;
  teamImage: string;
  projectName: string;
}

enum NegativeGithubFetchOutcome {
  COULD_NOT_GET_REPOS_FROM_GITHUB,
}

const ImportProject = ({ repoName }: ImportProps) => {
  const { colorMode } = useColorMode();
  return (
    <Button
      w="full"
      variant="ghost"
      rounded="sm"
      onClick={createProject}
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
  equals: (repo0, repo1) =>
    repo0.owner.login === repo1.owner.login,
};

const groupReposByOwner = (repos: IRepository[]): IRepositoriesGroupedByOwner =>
  groupSort(ordRepositoryByOwner)(repos);


async function authorizeGithub() {
  // This is a placholder for the function that calls the GitHub API for what Meeshkan is installed on an returns an object currently represented by a variable called 'owners'. This includes the organizations with Meeshkan installed, and lists the specific repos below.
  return null;
}

export default function Home(ssrProps: IProjectsProps) {
  if (isLeft(ssrProps)) {
    //useRouter().push("/404");
    return <></>;
  }
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const newProps = useProjects(ssrProps.right.session);

  const session =
    isRight(newProps) && isRight(newProps.right)
      ? newProps.right.right.session
      : ssrProps.right.session;

  const projectsProps =
    isRight(newProps) && isRight(newProps.right)
      ? newProps.right.right
      : ssrProps.right;

  const [owner, setOwner] = useState(
    left(Loading) as Either<
      Loading,
      Either<NegativeGithubFetchOutcome, Option<IOwner>>
    >
  );

  const [ownerRepos, setOwnerRepos] = useState(
    left(Loading) as Either<
      Loading,
      Either<NegativeGithubFetchOutcome, Option<NonEmptyArray<IRepository>>>
    >
  );

  const repoList = hookNeedingFetch<
    Either<NegativeGithubFetchOutcome, NonEmptyArray<IRepository>[]>
  >(async () => {
    const res = await fetch("/api/gh/repos");
    const repos = res.ok
      ? ((await res.json()) as Either<
          NegativeGithubFetchOutcome,
          IRepository[]
        >)
      : left(NegativeGithubFetchOutcome.COULD_NOT_GET_REPOS_FROM_GITHUB);
    if (isRight(repos)) {
      const groupedRepos = groupReposByOwner(repos.right);
      if (isLeft(owner) || isLeft(owner.right)) {
        const owners = groupedRepos.map((a) => head(a).owner);
        setOwner(
          right(
            right(owners.length > 0 ? some(head(groupedRepos[0]).owner) : none)
          )
        );
        setOwnerRepos(
          right(right(groupedRepos.length > 0 ? some(groupedRepos[0]) : none))
        );
      }
      return right(groupedRepos);
    }
    return repos;
  });

  return (
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
        {teamsToProjects(projectsProps.teams).map(
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
          minH="100%"
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
                                        right(some(head(reposForOwner).owner))
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
                          ownerRepos.right.right.value.map((project, index) => (
                            <ImportProject
                              key={index}
                              repoName={project.name}
                            />
                          ))}
                      </Stack>
                    </>
                  )
                )}
              </ModalBody>
              <ModalFooter d="flex" justifyContent="center" fontSize="sm">
                {(isLeft(repoList) || isLeft(repoList.right)) && (
                  <>
                    <Text mr={2} color={`mode.${colorMode}.text`}>
                      Not seeing the repository you want?
                    </Text>
                    <ChakraLink
                      href={`https://github.com/apps/meeshkan/installations/new?state={"env":"${process.env.GITHUB_AUTH_ENV}","id":"${session.user.sub}"}`}
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
  );
}
