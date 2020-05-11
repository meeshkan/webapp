import React from "react";
import Link from "next/link";
import {
  Stack,
  Text,
  Grid,
  Image,
  useColorMode,
  Heading,
  Icon,
  Link as ChakraLink,
} from "@chakra-ui/core";
import auth0 from "../../utils/auth0";
import Card from "../../components/molecules/card";


export async function getServerSideProps(context) {
  const {
    params: { projectName },
    req
  } = context;
  const { user } = await auth0.getSession(req);

  // TODO: create graphql query to get the project based projectName

  return {
    props: { projectName },
  };
}

export default function OrganizationPage({ projects, teamId }) {
  const { colorMode } = useColorMode();
  const orgProjects = projects.filter(
    (project) => project.owner.login === teamId
  );
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {orgProjects.map(({ owner: { login, avatarUrl }, name }, index) => (
          <Link key={name} href={`/${teamId}/${name}`}>
            <a>
              <Card key={index}>
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
                      {teamId}
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
            </a>
          </Link>
        ))}
        <ChakraLink
          href="https://github.com/apps/meeshkan/installations/new"
          bg={`mode.${colorMode}.card`}
          p={4}
          rounded="sm"
          color={`mode.${colorMode}.title`}
          _hover={{ color: `mode.${colorMode}.titleHover` }}
        >
          <Stack spacing={4} align="center" isInline>
            <Icon h={10} w={10} name="add" stroke="2px" />
            <Heading as="h3" lineHeight="none" fontSize="md" fontWeight={900}>
              Authorize a repository
            </Heading>
          </Stack>
        </ChakraLink>
      </Grid>
    </>
  );
}
