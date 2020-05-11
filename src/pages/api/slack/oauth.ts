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

    if (session.user.sub !== state) {
        res.status(403);
        res.send('Forbidden');
    }

    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', process.env.SLACK_OAUTH_APP_CLIENT_ID);
    params.append('client_secret', process.env.SLACK_OAUTH_APP_CLIENT_SECRET);
    params.append('redirect_uri', process.env.SLACK_OAUTH_REDIRECT_URI);
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
              auth0Id: "${session.user.sub}"
            }
          }
        }) {
          id
        }
    }`);
  
    await gcmsGraphQLClient.request(`mutation {
      publishSlackIncomingWebhook(where: {id: "${gcmsResponse.createSlackIncomingWebhook.id}" }) {
        id
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