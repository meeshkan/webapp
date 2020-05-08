import auth0 from '../../../utils/auth0';
import { GraphQLClient } from 'graphql-request';
import fetch from 'isomorphic-unfetch';

export default async function me(req, res) {
  try {
    const session = await auth0.getSession(req);
    if (!session) {
        res.status(403);
        res.send();
    }

    // the code parameter is what we will exchange with slack
    // for more information
    // the state parameter is the user id
    const {
      query: {
        code,
        state
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

    if (ghData.user.id !== state) {
        res.status(403);
        res.send('Forbidden');
    }

    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', process.env.SLACK_OAUTH_APP_CLIENT_ID);
    params.append('client_secret', process.env.SLACK_OAUTH_APP_CLIENT_SECRET);
    params.append('redirect_uri', 'http://localhost:3000/api/slack/oauth');
    const resFromSlack = await fetch(process.env.SLACK_OAUTH_APP_URL, {
      method: 'post',
      body: params
    });
    const dataFromSlack = resFromSlack.ok ? await resFromSlack.json() : null;
    if (!dataFromSlack || !dataFromSlack.ok) {
      console.log("error from slack", code, dataFromSlack);
      res.status(401);
      res.send('Bad data from slack');
    }

    console.log(dataFromSlack);
    const {
      access_token,
      scope,
      team: { name, id },
      incoming_webhook: {
          url,
          channel,
          configuration_url
      },
      bot_user_id
    } = dataFromSlack;

    const gcmsGraphQLClient = new GraphQLClient('https://api-eu-central-1.graphcms.com/v2/ck9bm6pqe04r901yy473r544s/master', {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_AUTH_TOKEN}`,
      },
    });

    const gcmsResponse = await gcmsGraphQLClient.request(`mutation {
        createSlackIncomingWebhook(data:{
          configurationUrl:"${configuration_url}"
          accessToken:"${access_token}"
          teamName:"${name}"
          botUserId:"${bot_user_id}"
          channel: "${channel}"
          teamId:"${id}"
          scope:"${scope}"
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
    res.writeHead(301, {
      Location: '/'
    });
    res.end();
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}