import parseLinkHeader from "parse-link-header";
import { GraphQLClient } from "graphql-request";
import crypto from "crypto";
import { confirmOrCreateUser } from "./user";
import { decrypt, encrypt } from "./sec";
import querystring from "querystring";
import { left, right, Either, isLeft } from "fp-ts/lib/Either";
import fetch from "isomorphic-unfetch";
import { Eq } from "fp-ts/lib/Eq";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as t from "io-ts";

const Owner = t.type({
  login: t.string,
  id: t.number,
  node_id: t.string,
  avatar_url: t.string,
});

export type IOwner = t.TypeOf<typeof Owner>;

export const Permissions = t.type({
  admin: t.boolean,
  push: t.boolean,
  pull: t.boolean,
});

export type IPermissions = t.TypeOf<typeof Permissions>;

export const Repository = t.type({
  id: t.number,
  node_id: t.string,
  name: t.string,
  owner: Owner,
  url: t.string,
});

export type IRepository = t.TypeOf<typeof Repository>;

interface PARSING_ERROR {
  type: "PARSING_ERROR",
  errors: t.Errors
}
interface LOGIC_ERROR {
  type: "LOGIC_ERROR";
}
interface TYPE_SAFETY_ERROR {
  type: "TYPE_SAFETY_ERROR";
}
interface INTERNAL_REST_ENDPOINT_ERROR {
  type: "INTERNAL_REST_ENDPOINT_ERROR";
}
interface OAUTH_FLOW_ERROR {
  type: "OAUTH_FLOW_ERROR";
}
interface NO_TOKEN_YET {
  type: "NO_TOKEN_YET";
}
interface NEEDS_REAUTH {
  type: "NEEDS_REAUTH";
}
interface UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
  error: unknown;
}

export type NegativeGithubFetchOutcome =
  | NEEDS_REAUTH
  | NO_TOKEN_YET
  | PARSING_ERROR
  | OAUTH_FLOW_ERROR
  | UNDEFINED_ERROR
  | INTERNAL_REST_ENDPOINT_ERROR
  | LOGIC_ERROR
  | TYPE_SAFETY_ERROR;

export const eqNegativeGithubFetchOutcome: Eq<NegativeGithubFetchOutcome> = {
  equals: (x: NegativeGithubFetchOutcome, y: NegativeGithubFetchOutcome) => x.type === y.type
}

export const NEEDS_REAUTH = (): NegativeGithubFetchOutcome => ({
  type: "NEEDS_REAUTH",
});
export const UNDEFINED_ERROR = (error: unknown): NegativeGithubFetchOutcome => ({
  type: "UNDEFINED_ERROR",
  error,
});
export const PARSING_ERROR = (errors: t.Errors): NegativeGithubFetchOutcome => ({
  type: "PARSING_ERROR",
  errors,
});
export const NO_TOKEN_YET = (): NegativeGithubFetchOutcome => ({
  type: "NO_TOKEN_YET",
});
export const OAUTH_FLOW_ERROR = (): NegativeGithubFetchOutcome => ({
  type: "OAUTH_FLOW_ERROR",
});
export const INTERNAL_REST_ENDPOINT_ERROR = (): NegativeGithubFetchOutcome => ({
  type: "INTERNAL_REST_ENDPOINT_ERROR",
});
export const LOGIC_ERROR = (): NegativeGithubFetchOutcome => ({ type: "LOGIC_ERROR" });
export const TYPE_SAFETY_ERROR = (): NegativeGithubFetchOutcome => ({
  type: "TYPE_SAFETY_ERROR",
});

const TWENTY_SECONDS = 20;
const MS_IN_SEC = 1000;

export const fetchGithubAccessToken = async (
  session: ISession
): Promise<Either<NegativeGithubFetchOutcome, string>> => {
  const c = await confirmOrCreateUser(
    `id
    githubInfo {
      githubSyncChecksum
      githubSyncNonce
    }`,
    t.type({
      id: t.string,
      githubInfo: t.union([
        t.null,
        t.type({
          githubSyncChecksum: t.string,
          githubSyncNonce: t.string,
        }),
      ]),
    })
  )(session);

  if (isLeft(c)) {
    console.error("Bad type scheme, check your types", c);
    return left(LOGIC_ERROR());
  }

  const { id, githubInfo } = c.right;
  if (githubInfo === null) {
    console.log("No github token exists yet");
    return left(NO_TOKEN_YET());
  }
  const githubUser = JSON.parse(
    decrypt({
      iv: githubInfo.githubSyncNonce,
      encryptedData: githubInfo.githubSyncChecksum,
    })
  );
  if (
    githubUser.expiresAt - new Date().getTime() / MS_IN_SEC <
    TWENTY_SECONDS
  ) {
    if (
      githubUser.refreshTokenExpiresAt - new Date().getTime() / MS_IN_SEC <
      TWENTY_SECONDS
    ) {
      return left(NEEDS_REAUTH());
    } else {
      const params = new URLSearchParams();
      params.append("client_id", process.env.GH_OAUTH_APP_CLIENT_ID);
      params.append("client_secret", process.env.GH_OAUTH_APP_CLIENT_SECRET);
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", githubUser.refreshToken);

      const access_token = await authenticateAppWithGithub(id, params)(session);
      return access_token;
    }
  }
  return right(githubUser.accessToken);
};

export const getAllGhRepos = async (
  session: ISession
): Promise<Either<NegativeGithubFetchOutcome, IRepository[]>> => {
  const accessTokenEither = await fetchGithubAccessToken(session);
  if (
    isLeft(accessTokenEither) &&
    eqNegativeGithubFetchOutcome.equals(accessTokenEither.left, NEEDS_REAUTH())
  ) {
    console.log("Our github auth token is about to expire, we need reauth.");
    return left(NEEDS_REAUTH());
  }
  if (
    isLeft(accessTokenEither) &&
    eqNegativeGithubFetchOutcome.equals(accessTokenEither.left, NO_TOKEN_YET())
  ) {
    console.log("There is no github token yet.");
    return right([]);
  }
  if (isLeft(accessTokenEither)) {
    console.error(accessTokenEither.left);
    console.error("The app failed for reasons we don't quite understand.");
    return left(LOGIC_ERROR());
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
  let installationIds = [];
  let installationsUrl = "https://api.github.com/user/installations";
  while (true) {
    const idResFromGh = await fetch(installationsUrl, {
      headers: {
        Accept: "application/vnd.github.machine-man-preview+json",
        Authorization: `token ${accessTokenEither.right}`,
      },
    });
    const idDataFromGh = idResFromGh.ok ? await idResFromGh.json() : null;
    const idHeadersFromGh = idResFromGh.ok
      ? parseLinkHeader(idResFromGh.headers.get("Link"))
      : null;
    installationIds = installationIds.concat(
      idDataFromGh.installations.map((i) => i.id)
    );
    if (
      !idHeadersFromGh ||
      !idHeadersFromGh.next ||
      !idHeadersFromGh.next.url
    ) {
      break;
    }
    installationsUrl = idHeadersFromGh.next.url;
  }

  // Then, for each installation ID, we get the associated repositories
  let repositories: IRepository[] = [];
  for (var j = 0; j < installationIds.length; j++) {
    const installationId = installationIds[j];
    let repositoriesUrl = `https://api.github.com/user/installations/${installationId}/repositories`;
    while (true) {
      const repoResFromGh = await fetch(repositoriesUrl, {
        headers: {
          Accept: "application/vnd.github.machine-man-preview+json",
          Authorization: `token ${accessTokenEither.right}`,
        },
      });
      const repoHeadersFromGh = repoResFromGh.ok
        ? parseLinkHeader(repoResFromGh.headers.get("Link"))
        : null;
      const repoDataFromGh = repoResFromGh.ok
        ? await repoResFromGh.json()
        : null;
      repositories = repositories.concat(repoDataFromGh.repositories);
      if (
        !repoHeadersFromGh ||
        !repoHeadersFromGh.next ||
        !repoHeadersFromGh.next.url
      ) {
        break;
      }
      repositoriesUrl = repoHeadersFromGh.next.url;
    }
  }
  return right(repositories);
};

export const authenticateAppWithGithub = (
  userId: string,
  params: URLSearchParams
) => async (session: ISession): Promise<Either<NegativeGithubFetchOutcome, string>> => {
  const resFromGh = await fetch(process.env.GH_OAUTH_ACCESS_TOKEN_URL, {
    method: "post",
    body: params,
  });
  if (!resFromGh.ok) {
    console.error("Call to github did not work", params);
    return left(OAUTH_FLOW_ERROR());
  }
  const _dataFromGh = await resFromGh.text();
  const dataFromGh = querystring.parse(_dataFromGh);
  if (!dataFromGh.access_token) {
    console.error("Call to github did not yield an access token", dataFromGh);
    return left(LOGIC_ERROR());
  }

  const {
    refresh_token,
    access_token,
    expires_in,
    refresh_token_expires_in,
    token_type,
  } = dataFromGh;

  const ghGraphQLClient = new GraphQLClient("https://api.github.com/graphql", {
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  });

  let ghViewerId;
  try {
    ghViewerId = await ghGraphQLClient.request(`query {
      viewer {
        id
      }
    }`);
  } catch {
    // this happened once randomly where the github API
    // did not accept its own token, so it's important to acknowledge
    // it and fix it
    return left(OAUTH_FLOW_ERROR());
  }

  const _8baseGraphQLClient = new GraphQLClient(
    process.env.EIGHT_BASE_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${session.idToken}`,
      },
    }
  );

  // the length MUST be 16 for the cryptographic algorithm
  const salted_encrypted_data = encrypt(
    JSON.stringify({
      accessToken: t.string.is(access_token) ? access_token : access_token[0],
      refreshToken: t.string.is(refresh_token)
        ? refresh_token
        : refresh_token[0],
      tokenType: token_type,
      expiresAt:
        new Date().getTime() / MS_IN_SEC +
        parseInt(t.string.is(expires_in) ? expires_in : expires_in[0]),
      refreshTokenExpiresAt:
        new Date().getTime() / MS_IN_SEC +
        parseInt(
          t.string.is(refresh_token_expires_in)
            ? refresh_token_expires_in
            : refresh_token_expires_in[0]
        ),
      nodeId: ghViewerId.viewer.id,
    }),
    crypto.randomBytes(16)
  );

  const vars = {};
  // we try to update the refresh token
  try {
    await _8baseGraphQLClient.request(
      `mutation(
      $userId:ID!
      $githubSyncChecksum:String!
      $githubSyncNonce:String!
    ) {
      userUpdate(
        filter: {
          id:$userId
        }
        data:{
          githubInfo: {
            update: {
              githubSyncChecksum:$githubSyncChecksum
              githubSyncNonce:$githubSyncNonce
            }
          }
        }
      ) {
        id
      }
    }`,
      {
        userId,
        githubSyncChecksum: salted_encrypted_data.encryptedData,
        githubSyncNonce: salted_encrypted_data.iv,
      }
    );
  } catch (e) {
    // the gh info already, so we update instead
    await _8baseGraphQLClient.request(
      `mutation(
      $userId:ID!
      $githubSyncChecksum:String!
      $githubSyncNonce:String!
    ) {
      userUpdate(
        filter: {
          id:$userId
        }
        data:{
          githubInfo: {
            create:{
              githubSyncNonce:$githubSyncNonce
              githubSyncChecksum:$githubSyncChecksum
            }
          }
        }
      ) {
        id
      }
    }`,
      {
        userId,
        githubSyncChecksum: salted_encrypted_data.encryptedData,
        githubSyncNonce: salted_encrypted_data.iv,
      }
    );
  }
  return right(t.string.is(access_token) ? access_token : access_token[0]);
};
