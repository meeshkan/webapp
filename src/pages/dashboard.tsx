import React from "react";
import { Grid } from "@chakra-ui/core";
// import withAuth from "../components/molecules/withAuth";
import auth0 from "../utils/auth0";
// Cards
import Settings from "../components/Dashboard/settings";
import Production from "../components/Dashboard/production";
import Branch from "../components/Dashboard/branch";
import Chart from "../components/Dashboard/chart";
import Layout from "../components/layout";

const Dashboard = ({ user }) => {
  return (
    // @ts-ignore
    <Layout user={user}>
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
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <a href="https://github.com/apps/meeshkan/installations/new">
          Authenticate your app
        </a>
        <Settings />
        <Production />
        <Branch />
        <Chart />
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  // Here you can check authentication status directly before rendering the page,
  // however the page would be a serverless function, which is more expensive and
  // slower than a static page with client side authentication
  const { user } = await auth0.getSession(req);

  if (!user) {
    res.writeHead(302, {
      Location: "/api/login",
    });
    res.end();
    return;
  }

  return { props: { user } };
}

export default Dashboard;
