import parseLinkHeader from 'parse-link-header';
import { GraphQLClient } from 'graphql-request';
import { decrypt } from 'sec';

export const NEEDS_REAUTH = -1;
export const NO_TOKEN_YET = -2;
const TWENTY_SECONDS = 20;
const MS_IN_SEC = 1000;

export const fetchGithubAccessToken = async (auth0IdToken) => {
    await confirmOrCreateUser(auth0IdToken);
    const tokenRes = await _8baseGraphQLClient.request(``);
    if (tokenRes.githubUser.expiresAt - (new Date().getTime() / MS_IN_SEC) < TWENTY_SECONDS) {
        if (tokenRes.githubUser.refreshTokenExpiresAt - (new Date().getTime() / MS_IN_SEC) < TWENTY_SECONDS) {
            return NEEDS_REAUTH;
        } else {
            const params = new URLSearchParams();
            const refreshToken = decrypt({iv: tokenRes.githubUser.refreshTokenSalt, encryptedData: tokenRes.githubUser.refreshToken});
            params.append('client_id', process.env.GH_OAUTH_APP_CLIENT_ID);
            params.append('client_secret', process.env.GH_OAUTH_APP_CLIENT_SECRET);
            params.append('grant_type', 'refresh_token');
            params.append('refresh_token', refreshToken);
        
            const access_token = await oa(params);           
            return access_token;
        }
    }
    return decrypt({iv: tokenRes.githubUser.accessTokenSalt, encryptedData: tokenRes.githubUser.accessToken});
}

export const getAllGhRepos = async (auth0IdToken) => {
    const access_token = await fetchGithubAccessToken(auth0IdToken);
    if (access_token === NEEDS_REAUTH) {
        return NEEDS_REAUTH;
    }
    if (access_token === NO_TOKEN_YET) {
        return [];
    }
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
    return repositories;
}

const oa = async (params) => {
    console.log('calling '+ process.env.GH_OAUTH_ACCESS_TOKEN_URL);
    const resFromGh = await fetch(process.env.GH_OAUTH_ACCESS_TOKEN_URL, {
      method: 'post',
      body: params
    });
    const _dataFromGh = resFromGh.ok ? await resFromGh.text() : null;
    const dataFromGh = querystring.parse(_dataFromGh);
    if (!dataFromGh || !dataFromGh.access_token) {
      console.log("error from github", code, dataFromGh);
      res.status(401);
      res.send('Could not authenticate with github');
    }

    const {
      refresh_token,
      access_token,
      expires_in,
      refresh_token_expires_in,
      token_type
    } = dataFromGh;

    const ghGraphQLClient = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    });

    const ghViewerId = await ghGraphQLClient.request(`query {
      viewer {
        id
      }
    }`);

    console.log(ghViewerId);
    const _8baseGraphQLClient = new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
      headers: {
        authorization: `Bearer ${process.env.EIGHT_BASE_GH_USER_CREATE_UPDATE_AUTH_KEY}`,
      },
    });

    // the length MUST be 16 for the cryptographic algorithm
    const refresh_token_salt = cryptoRandomString({length: 16});
    const salted_encrypted_refresh_token = encrypt(refresh_token, refresh_token_salt);
    const access_token_salt = cryptoRandomString({length: 16});
    const salted_encrypted_access_token = encrypt(access_token, access_token_salt);

    const vars = {
        accessToken: salted_encrypted_access_token,
        refreshToken: salted_encrypted_refresh_token,
        accessTokenSalt: access_token_salt,
        refreshTokenSalt: refresh_token_salt,
        tokenType: token_type,
        expiresAt: (new Date().getTime () / 1000) + expires_in,
        refreshTokenExpiresAt: (new Date().getTime () / 1000) + refresh_token_expires_in,
        nodeId: ghViewerId.viewer.id
    };
    // we create the refresh token
    try {
      await _8baseGraphQLClient.request(`mutation(
        $accessToken:String!
        $refreshToken:String!
        $accessTokenSalt:String!
        $refreshTokenSalt:String!
        $tokenType:String!
        $expiresAt:BigInt!
        $refreshTokenExpiresAt:BigInt!
        $nodeId:String!
      ) {
        githubUserCreate(data: {
          accessToken:$accessToken
          refreshToken:$refreshToken
          accessTokenSalt:$accessTokenSalt
          refreshTokenSalt:$refreshTokenSalt
          tokenType:$tokenType
          expiresAt:$expiresAt
          refreshTokenExpiresAt:$refreshTokenExpiresAt
          nodeId:$nodeId
        }) {
          id
        }
      }`, vars);
    } catch (e) {
      console.log(e);
      // the user exists already, so we update instead
      await _8baseGraphQLClient(`mutation(
        $accessToken:String!
        $refreshToken:String!
        $accessTokenSalt:String!
        $refreshTokenSalt:String!
        $tokenType:String!
        $expiresAt:BigInt!
        $refreshTokenExpiresAt:BigInt!
        $nodeId:String!
      ) {
        githubUserUpdate(
          filter: {
            nodeId:$nodeId
          }
          data: {
            accessToken:$accessToken
            refreshToken:$refreshToken
            accessTokenSalt:$accessTokenSalt
            refreshTokenSalt:$refreshTokenSalt
            tokenType:$tokenType
            expiresAt:$expiresAt
            refreshTokenExpiresAt:$refreshTokenExpiresAt
            nodeId:$nodeId
        }) {
          id
        }
      }`, vars);
    }
    return access_token;
}