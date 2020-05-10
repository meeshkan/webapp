import auth0 from '../../../../utils/auth0';
import { GraphQLClient } from 'graphql-request';

export default async function me(req, res) {
  try {
    const session = await auth0.getSession(req);
    const {
      query: { repoId },
    } = req;

    const gcmsGraphQLClient = new GraphQLClient('https://api-eu-central-1.graphcms.com/v2/ck9bm6pqe04r901yy473r544s/master', {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_QUERY_AUTH_TOKEN}`,
      },
    });

    const { project } = await gcmsGraphQLClient.request(`query {
      project(where: {
        githubRepositoryNodeId: "${repoId}"
      }) {
        githubRepositoryNodeId
        user {
          auth0Id
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

    if (session.user.sub !== project.user.auth0Id) {
      // someone is being naughty...
      res.status(403);
      res.json({"msg": "You seem to be pretty good at hacking! You should come work for Meeshkan."});
    } else {
      res.json(project);
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}