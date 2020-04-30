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

export async function getServerSideProps(context) {
  const {
    params: { organizationName }
  } = context;

  const query = `
  query OrganizationPageQuery($organizationName: String) {
    projects(where: { organizationName: $organizationName }) {
      organizationName
      organizationImage {
        handle
      }
      repositoryName
    }
  }
`

  const request = await graphcms.request(query, {
    organizationName: organizationName
  });

  let { projects } = request;

  console.log(request)

  return {
    props: {
      projects
    }
  }
}

export default function ({ projects }) {
  const { colorMode } = useColorMode();
  console.log(projects)
  return(
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      {projects.map(({ organizationName, organizationImage, repositoryName, index }) => (
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