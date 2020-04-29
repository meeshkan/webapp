import React from "react";
import { Grid } from "@chakra-ui/core";

// cards
import Settings from "../../../components/Dashboard/settings";
import Production from "../../../components/Dashboard/production";
import Branch from "../../../components/Dashboard/branch";
import Chart from "../../../components/Dashboard/chart";

const Dashboard = () => {
  return (
    <>
    <h1>Hello again??????</h1>
    <Grid
      templateColumns="repeat(3, 1fr)"
      templateRows="repeat(2, 1fr)"
      gap={8}
      // pos="fixed"
      // bottom={8}
      // right={8}
      // left={8}
      // top={128}
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
