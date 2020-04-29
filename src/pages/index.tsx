import React from "react";
import Link from 'next/link';
import {
  Stack,
  Text,
  Grid,
  Image,
  useColorMode,
  Heading,
  Icon,
  Link as ChakraLink
} from "@chakra-ui/core";
import Card from "../components/molecules/card";
import { GraphQLClient } from "graphql-request";

const graphcms = new GraphQLClient(process.env.gcms);

export async function getStaticProps() {
  const { projects } = await graphcms.request(
    `
    query ByUser($user: String) {
      projects(where: {user: $user}) {
        tests {
          branchName
          failureMessage
          id
          testDate
          testStatus
          testType
        }
        user
        organizationName
        organizationImage {
          handle
        }
        repositoryName
      }
    }
  `,
    {
      user: "KenzoBenzo",
    }
  );

  return {
    props: {
      projects,
    },
  };
}

export default function Home({ projects }) {
  const { colorMode } = useColorMode();
  console.log(projects)
  return(
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      {projects.map(({ organizationName, organizationImage, repositoryName, index }) => (
          <Link key={organizationName} href={`/${organizationName}/`}>
            <a>
          <Card key={index}>
            <Stack spacing={4} isInline>
              <Image
                size={10}
                src={`https://media.graphcms.com/${organizationImage.handle}`}
                bg="gray.50"
                border="1px solid"
                borderColor={`mode.${colorMode}.icon`}
                rounded="sm"
              />
              <Stack spacing={2}>
                <Text color={`mode.${colorMode}.text`} lineHeight="none">
                  {organizationName}
                </Text>
                <Heading
                  as="h3"
                  lineHeight="none"
                  fontSize="md"
                  fontWeight={900}
                >
                  {repositoryName}
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
  )
} 