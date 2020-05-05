import React from "react";
import { Grid } from "@chakra-ui/core";

// cards
import Settings from "../../../components/Dashboard/settings";
import Production from "../../../components/Dashboard/production";
import Branch from "../../../components/Dashboard/branch";
import Chart from "../../../components/Dashboard/chart";

// import { GraphQLClient } from "graphql-request";

// type DashboardProps = {
//   currentRepository: Array<any>;
// };

// const graphcms = new GraphQLClient(process.env.gcms);

// export async function getServerSideProps(context) {
//   const {
//     params: { repositoryName }
//   } = context;

//   const query = `
//     query RepositoryDataQuery($repositoryName: String) {
//       currentRepository: projects(where: {repositoryName: $repositoryName}) {
//         tests {
//           branchName
//           failureMessage
//           id
//           testDate
//           testStatus
//           testType
//         }
//         user
//         organizationName
//         repositoryName
//       }
//     }
//   `

//   const request = await graphcms.request(query, {
//     repositoryName: repositoryName
//   });

//   let { currentRepository } = request;

//   return {
//     props: {
//       currentRepository
//     }
//   }
// }

const Dashboard = (/*props: DashboardProps*/) => {
  // const tests = props.currentRepository[0].tests;

  // let branchTests = []
  // let productionTests = []
  // tests.forEach((test) => {
  //   if (test.testType === "master") {
  //     productionTests.push(test)
  //   } else {
  //     branchTests.push(test)
  //   }
  // })

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
