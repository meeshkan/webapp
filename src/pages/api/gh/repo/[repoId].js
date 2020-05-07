import auth0 from '../../utils/auth0';
import { GraphQLClient } from 'graphql-request';

export default async function me(req, res) {
  try {
    const { user } = await auth0.getSession(req);
    const ghLogin = user.nickname;
    const {
      query: { repoId },
    } = req;
    const ghGraphQLClient = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        authorization: `Bearer ${process.env.GITHUB_USER_INFO_AUTH_TOKEN}`,
      },
    });
  
    const ghData = await ghGraphQLClient.request(`query {
      user(login: "${ghLogin}") {
              id
          }
      }`);
    ghData.user.id;

    const gcmsGraphQLClient = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_QUERY_AUTH_TOKEN}`,
      },
    });

    const gcmsData = await gcmsGraphQLClient.request(`query {
      project(where: {
        githubRepositoryNodeId: "${repoId}"
      }) {
        githubRepositoryNodeId
        githubOrganizationNodeId
        user {
          githubUserNodeId
        }
        organizationImage {
          fileName
        }
        tests {
          branchName
          testDate
          testStatus
          failureMessage
          testType
        }
      }
    }`);

    if (ghData.user.id !== gcmsData.user.githubUserNodeId) {
      // someone is being naughty...
      res.status(403);
      res.json({"msg": "You seem to be pretty good at hacking! You should come work for Meeshkan."});
    } else {
      res.json(gcmsData);
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}