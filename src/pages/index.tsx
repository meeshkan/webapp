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
} from "@chakra-ui/core";
import auth0 from "../utils/auth0";
import { useRouter } from "next/router";
import Card from "../components/molecules/card";
import { isLeft, isRight, left, Either, right } from "fp-ts/lib/Either";
import * as t from "io-ts";
import {
  IProjectsProps,
  NegativeProjectsFetchOutcome,
  getProjects,
  useProjects,
  teamsToProjects,
} from "../utils/projects";
import { confirmOrCreateUser } from "../utils/user";
import { hookNeedingFetch } from "../utils/hookNeedingFetch";
import { IRepository } from "../utils/gh";
import { repos } from "../data/repoQuery";

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

type IOwnerToRepositories = Record<string, IRepository[]>;
interface IProject {
  teamName: string;
  teamImage: string;
  projectName: string;
}

enum NegativeGithubFetchOutcome {
  COULD_NOT_GET_REPOS_FROM_GITHUB
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

const groupReposByOwner = (repos: IRepository[]): IOwnerToRepositories =>
  Array.from(new Set(repos.map((repo) => repo.owner.login)))
    .map((owner) => ({
      owner: repos.filter((repo) => repo.owner.login === owner),
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});

async function authorizeGithub() {
  // This is a placholder for the function that calls the GitHub API for what Meeshkan is installed on an returns an object currently represented by a variable called 'owners'. This includes the organizations with Meeshkan installed, and lists the specific repos below.
  return null;
}

export default function Home(ssrProps: IProjectsProps) {
  if (isLeft(ssrProps)) {
    useRouter().push("/404");
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

  const repoList = hookNeedingFetch<Either<NegativeGithubFetchOutcome, IRepository[]>>(async () => {
    const res = await fetch("/api/gh/repos");
    const repos = res.ok ? right(await res.json()) : left(NegativeGithubFetchOutcome.COULD_NOT_GET_REPOS_FROM_GITHUB);
    return repos;
  });

  const ownerRecord = isRight(repoList) && isRight(repoList.right) ? groupReposByOwner(repoList.right.right) : {};
  const [owner, setOwner] = useState(Object.keys(ownerRecord)[0]);
  const githubAuthorized = isRight(repoList) && isRight(repoList.right);
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
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
                    {name}
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
          <ModalOverlay />
          <ModalContent rounded="sm" backgroundColor={`mode.${colorMode}.card`}>
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
              {!githubAuthorized ? (
                <Flex h="100%" justify="center" align="center">
                  <Button
                    rounded="sm"
                    fontWeight={900}
                    px={4}
                    variantColor="red"
                    onClick={e => {
                      e.preventDefault();
                      authorizeGithub();
                    }}
                  >
                    <Icon name="github" mr={2} />
                    Import from GitHub
                  </Button>
                </Flex>
              ) : (
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
                        // getting [0] is a safe operation
                        // beacuse the sorting algorithm guarantees
                        // that all lists have non-0 length
                        src={ownerRecord[owner][0].owner.avatar_url}
                        size={8}
                        roundedLeft="sm"
                        borderColor={`mode.${colorMode}.background`}
                      />
                      <Text mr={8} color={`mode.${colorMode}.text`}>
                        {owner}
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
                      <MenuOptionGroup defaultValue={owner} type="radio">
                        {Object.keys(ownerRecord).map((newOwner, index) => (
                          <MenuItemOption
                            key={index}
                            value={newOwner}
                            onClick={() => setOwner(newOwner)}
                          >
                            {newOwner}
                          </MenuItemOption>
                        ))}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                  <Stack>
                    {ownerRecord[owner].map((project, index) => (
                      <ImportProject key={index} repoName={project.name} />
                    ))}
                  </Stack>
                </>
              )}
            </ModalBody>
            <ModalFooter d="flex" justifyContent="center" fontSize="sm">
              {!githubAuthorized  ? null : (
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
        </Modal>
      </Grid>
    </>
  );
}
