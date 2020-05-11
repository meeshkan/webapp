import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Skeleton,
  Box,
  Heading,
  Flex,
  useColorMode
} from "@chakra-ui/core";
// cards
import Settings from "../../../components/Dashboard/settings";
import Production from "../../../components/Dashboard/production";
import Branch from "../../../components/Dashboard/branch";
import Chart from "../../../components/Dashboard/chart";

import fetch from "isomorphic-unfetch";
import hookNeedingFetch from "../../../utils/hookNeedingFetch";

export async function getServerSideProps(context) {
  const {
    params: { repositoryName },
  } = context;

  return {
    props: { repositoryName },
  };
}

const Dashboard = ({ projects, repositoryName }) => {

  const authorizedRepos = projects.filter(
    (project) => project.name === repositoryName
  );

  const canViewRepo = authorizedRepos.length > 0;

  const fetchRepo = async () => {
    if (authorizedRepos.length > 0) {
      const res = await fetch(`/api/gh/repo/${authorizedRepos[0].id}`);
      const result = res.ok ? await res.json() : null;
      return result;  
    } else {
      return null;
    }
  };
  
  const [ repo, loadingRepo ] = hookNeedingFetch(fetchRepo);

  let branchTests = [];
  let productionTests = [];

  repo.tests.forEach((test) => {
    if (test.testType === "master") {
      productionTests.push(test);
    } else {
      branchTests.push(test);
    }
  });

  const { colorMode } = useColorMode();
  return (
    <>
    {!canViewRepo &&
        <Box as="section" my={12}>
          <Heading
            as="h2"
            color={`mode.${colorMode}.title`}
            textAlign="center"
            mb={4}
          >
            Oops!
          </Heading>
          <Flex justify="center">
            We asked GitHub (nicely), and it looks like you do not have permission to access build information for that repo. Fear not! You can install Meeshkan for {name} or, if it is already installed, contact your organization and make sure you have access to it.
          </Flex>
        </Box>}
      {canViewRepo && !repo && <Skeleton isLoaded={!loadingRepo}>
      <Box as="section" my={12}>
          <Heading
            as="h2"
            color={`mode.${colorMode}.title`}
            textAlign="center"
            mb={4}
          >
            Oh no!
          </Heading>
          <Flex justify="center">
            Well, this is embarassing. It looks like we could not laod your repo. It's a bug, our engineers are working to fix it, and it will be up and running soon!
          </Flex>
        </Box>
        </Skeleton>}
      {canViewRepo && repo && <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(2, minmax(204px, 45%))"
        gap={8}
      >
        <Settings
          // organizationName={organizationName}
          repositoryName={repositoryName}
        />
        <Production tests={productionTests} />
        <Branch tests={branchTests} />
        <Chart />
      </Grid>}
    </>
  );
};

export default Dashboard;
