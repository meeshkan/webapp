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
import { isLeft, isRight, left } from "fp-ts/lib/Either";
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

const ImportProject = ({ repoName }: ImportProps) => {
  return (
    <Button
      w="full"
      variant="ghost"
      rounded="sm"
      onClick={createProject}
      justifyContent="space-between"
    >
      <Flex align="center">
        <Icon name="github" mr={2} />
        <Text>{repoName}</Text>
      </Flex>
      <Icon name="chevron-right" />
    </Button>
  );
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

const groupReposByOwner = (repos: IRepository[]): IOwnerToRepositories =>
  Array.from(new Set(repos.map((repo) => repo.owner.login)))
    .map((owner) => ({
      owner: repos.filter((repo) => repo.owner.login === owner),
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});

export default function Home(ssrProps: IProjectsProps) {
  if (isLeft(ssrProps)) {
    useRouter().push("/404");
    return <></>;
  }
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const newProps = useProjects(ssrProps.right.session);
  const projectsProps =
    isRight(newProps) && isRight(newProps.right)
      ? newProps.right.right
      : ssrProps.right;

  const repoList = hookNeedingFetch<IRepository[]>(async () => {
    const res = await fetch("/api/gh/repos");
    const repos = res.ok ? await res.json() : [];
    return repos;
  });

  const ownerRecord = isRight(repoList) ? groupReposByOwner(repoList.right) : {};
  const [owner, setOwner] = useState(Object.keys(ownerRecord)[0]);
  return (
    <>
      {" "}
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
          rounded="sm"
          lineHeight="none"
          fontSize="md"
          fontWeight={900}
          bg={`mode.${colorMode}.card`}
          color={`mode.${colorMode}.title`}
          _hover={{ color: `mode.${colorMode}.titleHover` }}
        >
          <Icon h={10} w={10} name="add" stroke="2px" />
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
          <ModalContent rounded="sm">
            <ModalHeader
              borderBottom="1px solid"
              borderColor="gray.100"
              mx={4}
              px={0}
              pt={4}
              pb={2}
              fontWeight={900}
            >
              Import a project to Makenna’s Team
            </ModalHeader>
            <ModalCloseButton rounded="sm" size="sm" mt={2} mr={0} />
            <ModalBody px={2}>
              <Menu closeOnSelect={true}>
                <MenuButton
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  minWidth="204px"
                  border="1px solid"
                  borderColor="gray.200"
                  p={2}
                  rounded="sm"
                  ml={2}
                  mb={4}
                >
                  {owner}
                  <Icon
                    name="arrow-up-down"
                    size="12px"
                    color="gray.500"
                    mr={2}
                  />
                </MenuButton>
                <MenuList border="none" placement="bottom-start">
                  <MenuOptionGroup defaultValue={owner} type="radio">
                    {ownerRecord[owner].map((repo, index) => (
                      <MenuItemOption
                        key={index}
                        value={repo.name}
                        onClick={() => setOwner(owner)}
                      >
                        {repo.name}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
              <Stack>
                {ownerRecord[owner].map((repo, index) => (
                  <ImportProject key={index} repoName={repo.name} />
                ))}
              </Stack>
            </ModalBody>
            <ModalFooter d="flex" justifyContent="center" fontSize="sm">
              <Text mr={2}>Not seeing the repository you want?</Text>
              <ChakraLink
                href="https://github.com/apps/meeshkan/installations/new"
                color="blue.500"
              >
                Configure on GitHub.
              </ChakraLink>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Grid>
    </>
  );
}
