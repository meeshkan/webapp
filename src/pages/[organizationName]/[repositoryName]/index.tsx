import React from "react";
import { Grid } from "@chakra-ui/core";

// cards
import Settings from "../../../components/Dashboard/settings";
import Production from "../../../components/Dashboard/production";
import Branch from "../../../components/Dashboard/branch";
import Chart from "../../../components/Dashboard/chart";

import { GraphQLClient } from "graphql-request";

const graphcms = new GraphQLClient(process.env.gcms);

export async function getServerProps(context) {
  const {
    params: { repositoryName }
  } = context;

  const query = `
    query RepositoryDataQuery($repositoryName: String) {
      currentRepository: projects(where: {repositoryName: $repositoryName}) {
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
        repositoryName
      }
    }
  `

  const request = await graphcms.request(query, {
    repositoryName: repositoryName
  });

  let { currentRepository } = request;

  return {
    props: {
      currentRepository
    }
  }
}

const Dashboard = ({ currentRepository }) => {
  console.log(currentRepository)
  return (
    <>
    <h1>{currentRepository}</h1>
    <Grid
      templateColumns="repeat(3, 1fr)"
      templateRows="repeat(2, 1fr)"
      gap={8}
    >
      <Settings />
      <Production />
      <Branch />
      <Chart />
    </Grid>
    </>
  );
};

export default Dashboard;
