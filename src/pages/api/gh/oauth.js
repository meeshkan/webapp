import auth0 from '../../../utils/auth0';
import { GraphQLClient } from 'graphql-request';
import fetch from 'isomorphic-unfetch';
import querystring from 'querystring';
import parseLinkHeader from 'parse-link-header';


export default async function me(req, res) {
  try {
    const session = await auth0.getSession(req);
    if (!session) {
        res.status(403);
        res.send();
    }

    // the code parameter is what we will exchange with github
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
    params.append('client_id', process.env.GH_OAUTH_APP_CLIENT_ID);
    params.append('client_secret', process.env.GH_OAUTH_APP_CLIENT_SECRET);
    params.append('redirect_uri', process.env.GH_OAUTH_REDIRECT_URI);
    params.append('state', ghId);
    const resFromGh = await fetch(process.env.GH_OAUTH_APP_URL, {
      method: 'post',
      body: params
    });
    const _dataFromGh = resFromGh.ok ? await resFromGh.text() : null;
    const dataFromGh = querystring.parse(_dataFromGh);
    if (!dataFromGh || !dataFromGh.access_token) {
      console.log("error from github", code, dataFromGh);
      res.status(401);
      res.send('Bad data github');
    }

    const {
      refresh_token,
      access_token,
      expires_in,
      refresh_token_expires_in,
      token_type
    } = dataFromGh;

    const gcmsGraphQLClient = new GraphQLClient('https://api-eu-central-1.graphcms.com/v2/ck9bm6pqe04r901yy473r544s/master', {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_AUTH_TOKEN}`,
      },
    });

    // we upsert the refresh token
    const upsertedRefreshToken = await gcmsGraphQLClient.request(`mutation {
      createGithubToken(
          data: {
            refreshToken:""
            accessToken:""
            expiresAt:""
            refreshTokenExpiresAt:""
            tokenType:""
            user:{
              connect:{
                auth0Id:""
              }
            }
          }
      ) {
        id
      }
    }`);
  
    // we publish the upsert
    await gcmsGraphQLClient.request(`mutation {
      publishGithubRefreshToken(where: { id:"${upsertedRefreshToken.upsertGithubRefreshToken.id}" }) {
        id
      }
    }`);

    // The code below this comment is problematic and should be replaced
    // by something more slick eventually.
  
    // The problem is that we _synchronously_ find installations and
    // repositories before allowing the user to continue.
  
    // Because of that, it will feel slower than if we just allow the
    // user to continue before the graphcms db is updated.
  
    // However, if we allow the user to continue asynchronously,
    // the user will get back to our site before the backend has updated
    // and it will look like the repo has not been installed yet.
  
    // This problem would be solved if resFromGh above
    // contained information about the new repositories installed.
  
    // Unfortunately, it does not. GitHub sends repository
    // installation information to a separate webhook that is outside of
    // this flow (see https://developer.github.com/apps/building-github-apps/creating-a-github-app/)

    // In an extreme corner case, the code below will omit ids and repositories
    // if the user performs an additional installation while this code
    // is executing. In that scenario, certain repos may not appear
    // on their dashboard because it will mess with pagination. But that
    // would require the user to be doing two installations simultaneously,
    // which is rare.

    // First, we get installation ids
    const installationIds = [];
    let installationsUrl = "https://api.github.com/user/installations";
    while (true) {
      const idResFromGh = await fetch(installationsUrl, {
        headers: {
          Accept: "application/vnd.github.machine-man-preview+json",
          Authorization: `token ${access_token}`
        }
      });
      const idDataFromGh = idResFromGh.ok ? await idResFromGh.json() : null;
      const idHeadersFromGh = isResFromGh.ok ? parseLinkHeader(idResFromGh.headers.get("Link")) : null;
      if(!idHeadersFromGh.next || !idHeadersFromGh.next.url) {
        break;
      }
      for(var i = 0; i < idDataFromGh.installations.length; i++) {
        installationIds.push(idDataFromGh.installations[i].id);
      }
      installationsUrl = idHeadersFromGh.next.url
    }

    // Then, for each installation ID, we get the associated repositories
    const repositories = [];
    for (var j = 0; j < installationIds.length; j++) {
      installationId = installationIds[j];
      let repositoriesUrl = `https://api.github.com/user/installations/${installationId}/repositories`;
      while (true) {
        const repoResFromGh = await fetch(repositoriesUrl, {
          headers: {
            Accept: "application/vnd.github.machine-man-preview+json",
            Authorization: `token ${access_token}`
          }
        });
        const repoHeadersFromGh = repoResFromGh.ok ? parseLinkHeader(repoResFromGh.headers.get("Link")) : null;
        const repoDataFromGh = repoResFromGh.ok ? await repoResFromGh.json() : null;
        if(!repoHeadersFromGh.next || !repoHeadersFromGh.next.url) {
          break;
        }
        for(var i = 0; i < repoDataFromGh.repositories.length; i++) {
          repositories.push(repoDataFromGh.repositories[i]);
        }
        repositoriesUrl = repoHeadersFromGh.next.url;
      }
    }

    if (repositories.length === 0) {
      // Would be strange as they just installed our app, but hey, it could happen!
      res.writeHead(301, {
        Location: '/'
      });
      res.end();

    }

    const upsertProjectCommands = repositories.map((repository, i) => `q${i}: `);

    // We upsert the repository to graphcms.
    const upsertedProjects = await gcmsGraphQLClient.request(`mutation {
      ${upsertProjectCommands.join('\n')}
    }`);
  
    // we publish the upsert
    await gcmsGraphQLClient.request(`mutation {
      publishGithubRefreshToken(where: { id:"${upsertedRefreshToken.upsertGithubRefreshToken.id}" }) {
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