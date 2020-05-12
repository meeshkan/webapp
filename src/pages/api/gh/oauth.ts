import auth0 from '../../../utils/auth0';
import { authenticateAppWithGithub } from '../../../utils/gh';
import { confirmOrCreateUser } from '../../../utils/user';
import { isLeft } from "fp-ts/lib/Either";
import * as t from "io-ts";

export default async function me(req, res) {
  try {
    const session = await auth0.getSession(req);
    if (!session) {
        res.status(403);
        res.send('No active session');
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

    const tp = t.type({ id: t.string })
    const confirmResult  = await confirmOrCreateUser<t.TypeOf<typeof tp>>("id", session, tp.is);
    if (isLeft(confirmResult)) {
      console.error("Type safety error in graphql query");
      res.writeHead(404, {
        Location: '/404'
      });
      return;
    }
    const authenticationResult = await authenticateAppWithGithub(confirmResult.right.id, params, session);
    if (isLeft(authenticationResult)) {
      res.writeHead(404, {
        Location: '/404'
      });  
    } else {
      res.writeHead(301, {
        Location: '/'
      });        
    }

    res.end();
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}