import React from "react";
import { Grid, Text } from "@chakra-ui/core";
import Card from "../../../components/molecules/card";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { GraphQLClient } from "graphql-request";

// const getTests = () => {
//   new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
//     headers: {
//       authorization: `Bearer ${session.idToken}`,
//     },
//   }).request(
//     `query GET_TESTS($projectName: String, $teamName: String) {
//       testsList(filter: {project: {name: {equals: $projectName}, team: {name: { equals: $teamName}}}}) {
//         items {
//           id
//           createdAt
//           commitHash
//           status
//           location
//           log
//         }
//       }
//     }`,
//     { teamName, projectName }
//   ),}

const TestPage = () => {
  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      templateRows="repeat(2, minmax(204px, 45%))"
      gap={8}
    >
      <Card heading="Tests">
        <Text>yo</Text>
      </Card>
    </Grid>
  );
};

export default TestPage;
