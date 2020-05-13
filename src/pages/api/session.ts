import auth0 from '../../utils/auth0';
import { ISession } from '@auth0/nextjs-auth0/dist/session/session';

export default async function session(req, res) {
  try {
    const session: ISession = await auth0.getSession(req);
    if (!session) {
      res.status(401).end("Not logged in");
      return;
    } else {
      res.json(session);
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}