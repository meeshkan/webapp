import React from "react";
import { Grid } from "@chakra-ui/core";
import { parseCookies } from "nookies";
import fetch from "isomorphic-fetch";

// Cards
import Settings from "../components/Dashboard/settings";
import Production from "../components/Dashboard/production";
import Branch from "../components/Dashboard/branch";
import Chart from "../components/Dashboard/chart";

function Home(props) {
  return (
    <>
      <h1>Welcome to Nextjs OAuth with GitHub</h1>
      {!props.authorization && (
        <a href={"http://localhost:3001/auth/github"}>Click here to login</a>
      )}
    </>
    // <Grid
    //   templateColumns="repeat(3, 1fr)"
    //   templateRows="repeat(2, 1fr)"
    //   gap={8}
    //   // pos="fixed"
    //   // bottom={8}
    //   // right={8}
    //   // left={8}
    //   // top={128}
    // >
    //   <Settings />
    //   <Production />
    //   <Branch />
    //   <Chart />
    // </Grid>
  );
}
async function getUser(authorization) {
  const res = await fetch("http://localhost:3001/user", {
    headers: { authorization },
  });

  if (res.status === 200) return { authorization, user: res.data };
  else return { authorization };
}

Home.getInitialProps = async (ctx) => {
  const { authorization } = parseCookies(ctx);
  const { token } = ctx.query;

  const props = getUser(authorization || token);

  return props;
};

export default Home;
