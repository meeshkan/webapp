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
import Card from "../components/molecules/card";
import * as t from "io-ts";
import { GraphQLClient } from "graphql-request";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import auth0 from "../utils/auth0";
import { confirmOrCreateUser } from "../utils/user";

enum NegativeProjectsFetchOutcome {
  NOT_LOGGED_IN,
  INVALID_TOKEN_ERROR,
  UNDEFINED_ERROR,
  QUERY_ERROR, // the query we made does not conform to the type we expect
}

const Team = t.type({
  image: t.union([
    t.null,
    t.type({
      downloadUrl: t.string,
    }),
  ]),
  name: t.string,
  project: t.type({
    items: t.array(
      t.type({
        name: t.string,
      })
    ),
  }),
});

type ITeam = t.TypeOf<typeof Team>;

const getProjects = async (
  session: ISession
): Promise<Either<NegativeProjectsFetchOutcome, ITeam[]>> => {
  const _8baseGraphQLClient = new GraphQLClient(
    process.env.EIGHT_BASE_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${session.idToken}`,
      },
    }
  );

  const query = `query {
    user {
      team {
        items{
          name
          image {
            downloadUrl
          }
          project {
            items {
              name
            }
          }
        }
      }
    }
  }`;

  try {
    const result = await _8baseGraphQLClient.request(query);
    const teams = result.user.team ? result.user.team.items : [];

    console.log(teams);
    return t.array(Team).is(teams)
      ? right(teams)
      : left(NegativeProjectsFetchOutcome.QUERY_ERROR);
  } catch (e) {
    if (
      e.response.errors.filter((error) => error.code === "InvalidTokenError")
        .length > 0
    ) {
      console.log(e);
      return left(NegativeProjectsFetchOutcome.INVALID_TOKEN_ERROR);
    }
    console.log(e);
    return left(NegativeProjectsFetchOutcome.UNDEFINED_ERROR);
  }
};

type IProjectsProps = Either<NegativeProjectsFetchOutcome, ITeam[]>;

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

interface IProject {
  teamName: string;
  teamImage: string;
  projectName: string;
}
const teamsToProjects = (teams: ITeam[]): IProject[] =>
  teams.flatMap(({ name, image, project: { items } }) =>
    items.map((item) => ({
      teamName: name,
      teamImage: image ? image.downloadUrl : "https://picsum.photos/200",
      projectName: item.name,
    }))
  );

type ImportProps = {
  repoName: String;
};

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

function createProject() {
  // This will execute the function that takes a repository and makes a project
  return null;
}

async function authorizeGithub() {
  // This is a placholder for the function that calls the GitHub API for what Meeshkan is installed on an returns an object currently represented by a variable called 'owners'. This includes the organizations with Meeshkan installed, and lists the specific repos below.
  return null;
}

export default function Home(projectsProps: IProjectsProps) {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [owner, setOwner] = useState(owners[0]);
  const [githubAuthorized, setGithubAuthorized] = useState(false);

  return isLeft(projectsProps) ? (
    <div>bad</div>
  ) : (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {teamsToProjects(projectsProps.right).map(
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
              {githubAuthorized === false ? (
                <Flex h="100%" justify="center" align="center">
                  <Button
                    rounded="sm"
                    fontWeight={900}
                    px={4}
                    variantColor="red"
                    onClick={() => {
                      authorizeGithub();
                      setGithubAuthorized(true);
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
                        src={owner.picture}
                        size={8}
                        roundedLeft="sm"
                        borderColor={`mode.${colorMode}.background`}
                      />
                      <Text mr={8} color={`mode.${colorMode}.text`}>
                        {owner.name}
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
                      <MenuOptionGroup defaultValue={owner.name} type="radio">
                        {owners.map((owner, index) => (
                          <MenuItemOption
                            key={index}
                            value={owner.name}
                            onClick={() => setOwner(owner)}
                          >
                            {owner.name}
                          </MenuItemOption>
                        ))}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                  <Stack>
                    {owner.projects.map((project, index) => (
                      <ImportProject key={index} repoName={project.repoName} />
                    ))}
                  </Stack>
                </>
              )}
            </ModalBody>
            <ModalFooter d="flex" justifyContent="center" fontSize="sm">
              {githubAuthorized === false ? null : (
                <>
                  <Text mr={2} color={`mode.${colorMode}.text`}>
                    Not seeing the repository you want?
                  </Text>
                  <ChakraLink
                    href="https://github.com/apps/meeshkan/installations/new"
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

// Replace this with the Github organizations the user has configured access to
const owners = [
  {
    picture: "https://media.graphcms.com/gRq2y5BsRNqNNrlPwTgX",
    name: "KenzoBenzo",
    projects: [
      {
        repoName: "personal-portfolio",
      },
      {
        repoName: "be-freaking-kind",
      },
      {
        repoName: "Cut-and-Paste",
      },
      {
        repoName: "DesignToCode",
      },
      {
        repoName: "personal-portfolio",
      },
      {
        repoName: "be-freaking-kind",
      },
      {
        repoName: "Cut-and-Paste",
      },
      {
        repoName: "DesignToCode",
      },
      {
        repoName: "personal-portfolio",
      },
      {
        repoName: "be-freaking-kind",
      },
      {
        repoName: "Cut-and-Paste",
      },
      {
        repoName: "DesignToCode",
      },
    ],
  },
  {
    picture: "https://media.graphcms.com/ZUjeEBiaT9iGYxhI5kzq",
    name: "Meeshkan",
    projects: [
      {
        repoName: "Website",
      },
      {
        repoName: "Webapp",
      },
    ],
  },
];
