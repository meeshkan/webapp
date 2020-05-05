import { initAuth0 } from "@auth0/nextjs-auth0";

export default initAuth0({
  domain: process.env.DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: "openid profile read:user user:email",
  redirectUri: "http://localhost:3000/api/callback",
  postLogoutRedirectUri: "http://localhost:3000/",
  session: {
    // The secret used to encrypt the cookie.
    cookieSecret: "this-is-a-terrible-cookie-secret-and-should-be-changed",
    // The cookie lifetime (expiration) in seconds. Set to 8 hours by default.
    cookieLifetime: 60 * 60 * 8,
    // (Optional) Store the access_token in the session. Defaults to false.
    storeAccessToken: true,
  },
  oidcClient: {
    // (Optional) Configure the timeout in milliseconds for HTTP requests to Auth0.
    httpTimeout: 2500,
    // (Optional) Configure the clock tolerance in milliseconds, if the time on your server is running behind.
    clockTolerance: 10000,
  },
});
