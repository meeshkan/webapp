import auth0 from '../../../../utils/auth0';
import { GraphQLClient } from 'graphql-request';

export default async function me(req, res) {
  try {
    const session = await auth0.getSession(req);
    if (!session) {
        res.status(403);
        res.send();
    }
    const {
        query: {
            userId
        },
        body: {
            access_token,
            scope,
            team_name,
            team_id,
            incoming_webhook: {
                url,
                channel,
                configuration_url
            },
            bot:{
                bot_user_id,
                bot_access_token
            }
        }
    } = req;
    const { user } = session;
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


    if (ghData.user.id !== userId) {
        res.status(403);
        res.send();
    }
    const gcmsGraphQLClient = new GraphQLClient('https://api-eu-central-1.graphcms.com/v2/ck9bm6pqe04r901yy473r544s/master', {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_QUERY_AUTH_TOKEN}`,
      },
    });

    await gcmsGraphQLClient.request(`mutation {
        createSlackIncomingWebhook(data:{
          configurationUrl:"${configuration_url}"
          accessToken:"${access_token}"
          teamName:"${team_name}"
          botUserId:"${bot_user_id}"
          channel: "${channel}"
          teamId:"${team_id}"
          botAccessToken:"${bot_access_token}"
          url:"${url}"
          sender:{
            connect: {
              githubUserNodeId: "${ghData.user.id}"
            }
          }
        }) {
          sender {
            githubUserNodeId
          }
        }
      }`);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}