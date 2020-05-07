import React from "react";
import { Grid } from "@chakra-ui/core";

// cards
import Settings from "../../../components/Dashboard/settings";
import Production from "../../../components/Dashboard/production";
import Branch from "../../../components/Dashboard/branch";
import Chart from "../../../components/Dashboard/chart";

import fetch from "isomorphic-unfetch";
import { useFetchUser } from "../../../utils/user";

const Dashboard = ({ organizationName, repositoryName }) => {
  const [repo, setRepo] = React.useState({ tests: [] });
 
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/gh/repo/"+repositoryName);
      const result = res.ok ? await res.json() : null;
      setRepo(result);
    };
    fetchData();
  }, []);

  let branchTests = []
  let productionTests = []
  repo.tests.forEach((test) => {
  if (test.testType === "master") {
      productionTests.push(test)
    } else {
        branchTests.push(test)
    }
  })

  return (
    <>
      <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(2, 1fr)"
        gap={8}
      >
        {/* <Settings
        repositoryName={props.currentRepository[0].repositoryName}
      />
      <Production tests={productionTests} />
      <Branch tests={branchTests} /> */}
        <Chart />
      </Grid>
    </>
  );
};

export default Dashboard;
