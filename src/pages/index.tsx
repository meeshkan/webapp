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

export default ({ projects }) => 
  projects.map(({ organizationName, repositoryName }) => {
    return(
      <Link key={organizationName} href={`/${organizationName}/`}>
        <a>{organizationName}/{repositoryName}</a>
      </Link>
    );
  })