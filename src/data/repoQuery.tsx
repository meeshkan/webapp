export const repos = [
  {
    image: "https://media.graphcms.com/ZUjeEBiaT9iGYxhI5kzq",
    organization: "meeshkan",
    repository: "test-repo",
  },
  {
    image: "https://media.graphcms.com/gRq2y5BsRNqNNrlPwTgX",
    organization: "KenzoBenzo",
    repository: "personal-portfolio",
  },
];

import { GraphQLClient } from "graphql-request";

const graphcms = new GraphQLClient(
  process.env.GRAPHCMS_ENDPOINT
);

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