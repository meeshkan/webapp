import auth0 from '../../../utils/auth0';
import { getAllGhRepos } from '../../../utils/gh';

export default async function me(req, res) {
  try {
    const session = await auth0().getSession(req);
    if (!session) {
      res.status(403);
      res.send('Not logged in');
      return;
    }
    const allGhRepos = await getAllGhRepos(session);
    res.json(allGhRepos);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}