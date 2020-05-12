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
// import { useFetchUser } from "../utils/user";
// import { useFetchProjects } from "../utils/projects";

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

export default function Home({ projects }) {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [owner, setOwner] = useState(owners[0]);
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {projects.map(({ owner: { login, avatarUrl }, name }, index) => (
          <Card key={index} link={`/${login}/${name}`}>
            <Stack spacing={4} isInline>
              <Image
                size={10}
                src={avatarUrl}
                bg="gray.50"
                border="1px solid"
                borderColor={`mode.${colorMode}.icon`}
                rounded="sm"
              />
              <Stack spacing={2}>
                <Text color={`mode.${colorMode}.text`} lineHeight="none">
                  {login}
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
        ))}

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
                  {owner.name}
                  <Icon
                    name="arrow-up-down"
                    size="12px"
                    color="gray.500"
                    mr={2}
                  />
                </MenuButton>
                <MenuList border="none" placement="bottom-start">
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

// Replace this with the Github organizations the user has configured access to
const owners = [
  {
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
