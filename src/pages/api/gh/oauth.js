import auth0 from '../../../utils/auth0';
import { oa } from '../../../utils/gh';
import {encrypt} from '../../../utils/sec';
import { GraphQLClient } from 'graphql-request';
import fetch from 'isomorphic-unfetch';
import querystring from 'querystring';
import  cryptoRandomString from 'crypto-random-string';

export default async function me(req, res) {
  try {
    const session = await auth0.getSession(req);
    if (!session) {
        res.status(403);
        res.send('');
    }

    // the code parameter is what we will exchange with github
    // the state parameter is the user id
    const {
      query: {
        code,
        state
      }
    } = req;

    if (session.user.sub !== JSON.parse(state).id) {
      res.status(403);
      res.send('Forbidden');
    }

    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', process.env.GH_OAUTH_APP_CLIENT_ID);
    params.append('client_secret', process.env.GH_OAUTH_APP_CLIENT_SECRET);
    params.append('redirect_uri', process.env.GH_OAUTH_REDIRECT_URI);
    params.append('state', state);

    await oa(params);

    res.writeHead(301, {
      Location: '/'
    });
    res.end();
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}