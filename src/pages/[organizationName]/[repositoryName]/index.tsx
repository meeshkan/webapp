import React, { useState, useEffect } from "react";
import { Grid } from "@chakra-ui/core";

// cards
import Settings from "../../../components/Dashboard/settings";
import Production from "../../../components/Dashboard/production";
import Branch from "../../../components/Dashboard/branch";
import Chart from "../../../components/Dashboard/chart";

import fetch from "isomorphic-unfetch";
import { useFetchUser } from "../../../utils/user";

export async function getServerSideProps(context) {
  const {
    params: { repositoryName },
  } = context;

  return {
    props: { repositoryName },
  };
}

const Dashboard = ({ repositoryName }) => {
  const [repo, setRepo] = useState({
    tests: [],
  });

  const { user } = useFetchUser();
  const repoId = user.projects.filter(
    (project) => project.name === repositoryName
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/gh/repo/${repoId[0].id}`);
      const result = res.ok ? await res.json() : null;
      setRepo(result);
    };
    fetchData();
  }, []);

  let branchTests = [];
  let productionTests = [];

  repo.tests.forEach((test) => {
    if (test.testType === "master") {
      productionTests.push(test);
    } else {
      branchTests.push(test);
    }
  });

  return (
    <>
      <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(2, 1fr)"
        gap={8}
      >
        <Settings
          // organizationName={organizationName}
          repositoryName={repositoryName}
        />
        <Production tests={productionTests} />
        <Branch tests={branchTests} />
        <Chart />
      </Grid>
    </>
  );
};

export default Dashboard;
