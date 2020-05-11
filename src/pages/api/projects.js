import auth0 from '../../utils/auth0';
import { GraphQLClient } from 'graphql-request';

export default async function me(req, res) {
  try {
    const session = await auth0.getSession(req);
    if (!session || !session.user) {
      res.status(400);
      res.send('Not logged in');
    }
    const { user } = session;
    const allGhRepos = await getAllGhRepos(user.idToken);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}