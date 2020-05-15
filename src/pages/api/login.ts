import auth0 from "../../utils/auth0";

export default async function login(req, res) {
  try {
    if (req.session) {
      console.log("logged in");
      // we're already logged in
      // we need to run the default team hook, though, to make sure
      // the person has a default team
      // otherwise the app will remain in an inconsistent state
      res.writeHead(301, { Location: "/api/default-team-hook/" });
      return;
    }
    console.log("handling login");
    await auth0().handleLogin(req, res);
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
