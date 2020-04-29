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
import Card from "../../components/molecules/card";
import { GraphQLClient } from "graphql-request";

const graphcms = new GraphQLClient(process.env.gcms);

export async function getStaticProps({ paths }) {
  const { organizationProjects } = await graphcms.request(
    `
    query OrganizationPageQuery($organizationName: String) {
      projects(where: { organizationName: $organizationName }) {
        organizationName
        organizationImage {
          handle
        }
        repositoryName
      }
    }
  `,
  {
    organizationName: paths.organizationName,
  }
  );

  return {
    props: {
      organizationProjects
    }
  }
}

export async function getStaticPaths() {
  const { projects } = await graphcms.request(
    `
     {
        projects {
          organizationName
          organizationImage {
            handle
          }
          repositoryName
        }
      }
  `
  );

  return {
    paths: projects.map(({ organizationName }) => ({
      params: { organizationName },
    })),
    fallback: false,
  };
}

export default function ({ organizationProjects }) {
  const { colorMode } = useColorMode();
  console.log(organizationProjects)
  return(
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      {organizationProjects.map(({ organizationName, organizationImage, repositoryName, index }) => (
          <Link key={organizationName} href={`/${organizationName}/${repositoryName}`}>
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
      </Grid>
    </>
  )
} 