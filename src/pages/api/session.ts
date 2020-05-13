import auth0 from '../../utils/auth0';

export default async function session(req, res) {
  try {
    const session = auth0.getSession(req);
    if (session === null) {
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