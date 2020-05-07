import auth0 from '../../utils/auth0';
import { GraphQLClient } from 'graphql-request';

export default async function me(req, res) {
  try {
    const session = await auth0.getSession(req);
    if (!session || !session.user) {
      res.status(400);
      res.send();
    }
    const { user } = session;
    // fetch the user on github
    const ghLogin = user.nickname;
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
    user.node_id = ghData.user.id;

    const gcmsGraphQLClient = new GraphQLClient('https://api-eu-central-1.graphcms.com/v2/ck9bm6pqe04r901yy473r544s/master', {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_QUERY_AUTH_TOKEN}`,
      },
    });

    const gcmsData = await gcmsGraphQLClient.request(`query {
      projects(where: {
        user: { githubUserNodeId: "${user.node_id}" }
      }) {
        githubRepositoryNodeId
        githubOrganizationNodeId
        organizationImage {
          fileName
        }
      }
    }`);

    const projectsQuery = gcmsData.projects.map((project, i) => `q${i}: repository(id: "${project.githubRepositoryNodeId}") {
            owner {
                login
                avatarUrl
            }
            id
            name
        }`);
    if (projectsQuery.length > 0 ){
      const projectsData = await ghGraphQLClient.request(`query {
        ${projectsQuery.join('\n')}
        }`);
      user.projects = Object.values(projectsData);
    } else {
      user.projects = [];
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}