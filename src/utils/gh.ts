import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import crypto from "crypto";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { Either } from "fp-ts/lib/Either";
import { Eq } from "fp-ts/lib/Eq";
import { flow } from "fp-ts/lib/function";
import * as M from "fp-ts/lib/Monoid";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import { GraphQLClient } from "graphql-request";
import * as t from "io-ts";
import fetch from "isomorphic-unfetch";
import parseLinkHeader from "parse-link-header";
import querystring, { ParsedUrlQuery } from "querystring";
import {
  defaultGQLErrorHandler,
  INCORRECT_TYPE_SAFETY,
  INVALID_TOKEN_ERROR,
  NEEDS_REAUTH,
  NO_TOKEN_YET,
  OAUTH_FLOW_ERROR,
  REST_ENDPOINT_ERROR,
  UNDEFINED_ERROR,
  UNKNOWN_GRAPHQL_ERROR,
} from "./error";
import { decrypt, encrypt } from "./sec";
import { confirmOrCreateUser, getUserIdFromIdOrEnv } from "./user";
import {
  GITHUB_INFO_QUERY_OR_MUTATION,
  UPDATE_GITHUB_INFO_MUTATION,
  GITHUB_VIEWER_QUERY,
  CREATE_GITHUB_INFO_MUTATION,
} from "../gql/utils/gh";
import { eightBaseClient, upsertHack } from "./graphql";

const Owner = t.type({
  login: t.string,
  id: t.number,
  node_id: t.string,
  avatar_url: t.string,
});

export const TEAM_IMPORT_PROJECT = "TEAM_IMPORT_PROJECT";

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

export const storedAccessTokenType = t.type({
  accessToken: t.string,
  refreshToken: t.string,
  tokenType: t.string,
  expiresAt: t.number,
  refreshTokenExpiresAt: t.number,
  nodeId: t.string,
});
type StoredAccessTokenType = t.TypeOf<typeof storedAccessTokenType>;
export type IRepository = t.TypeOf<typeof Repository>;

export type NegativeGithubFetchOutcome =
  | NEEDS_REAUTH
  | NO_TOKEN_YET
  | OAUTH_FLOW_ERROR
  | UNDEFINED_ERROR
  | UNKNOWN_GRAPHQL_ERROR
  | INVALID_TOKEN_ERROR
  | REST_ENDPOINT_ERROR
  | INCORRECT_TYPE_SAFETY;

export const eqNegativeGithubFetchOutcome: Eq<NegativeGithubFetchOutcome> = {
  equals: (x: NegativeGithubFetchOutcome, y: NegativeGithubFetchOutcome) =>
    x.type === y.type,
};

const TWENTY_SECONDS = 20;
const MS_IN_SEC = 1000;

const githubAccessTokenType = t.type({
  id: t.string,
  githubInfo: t.union([
    t.null,
    t.type({
      githubSyncChecksum: t.string,
      githubSyncNonce: t.string,
    }),
  ]),
});
export const fetchGithubAccessToken = (
  session: ISession
): TE.TaskEither<NegativeGithubFetchOutcome, string> =>
  pipe(
    session,
    confirmOrCreateUser(GITHUB_INFO_QUERY_OR_MUTATION, githubAccessTokenType),
    TE.chain((githubAccessToken) =>
      githubAccessToken.githubInfo === null
        ? TE.left({
            type: "NO_TOKEN_YET",
            msg: "No token currently in db",
          })
        : TE.right(githubAccessToken)
    ),
    // JSON.parse is an unsafe operation, we probably want an
    // additional check at some point
    TE.chain(({ id, githubInfo }) =>
      TE.right({
        id,
        githubAccessToken: JSON.parse(
          decrypt(
            {
              iv: githubInfo.githubSyncNonce,
              encryptedData: githubInfo.githubSyncChecksum,
            },
            process.env.GH_TOKEN_SIGNING_KEY
          )
        ),
      })
    ),
    TE.chainEitherK(({ id, githubAccessToken }) =>
      pipe(
        githubAccessToken,
        storedAccessTokenType.decode,
        E.mapLeft(
          (errors): NegativeGithubFetchOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not decode the token from the graphql endpoint",
            errors,
          })
        ),
        E.chain((decodedGithubAccessToken) =>
          E.right({ id, githubAccessToken: decodedGithubAccessToken })
        )
      )
    ),
    TE.chain<
      NegativeGithubFetchOutcome, // need this explicit type because the io-ts decoder's type is too specific otherwise
      { id: string; githubAccessToken: StoredAccessTokenType },
      string
    >(({ id, githubAccessToken }) =>
      githubAccessToken.expiresAt - new Date().getTime() / MS_IN_SEC <
      TWENTY_SECONDS
        ? githubAccessToken.refreshTokenExpiresAt -
            new Date().getTime() / MS_IN_SEC <
          TWENTY_SECONDS
          ? TE.left({
              type: "NEEDS_REAUTH",
              msg: "Refresh token expires soon",
            })
          : authenticateAppWithGithub(
              id,
              new URLSearchParams({
                client_id: process.env.GH_OAUTH_APP_CLIENT_ID,
                client_secret: process.env.GH_OAUTH_APP_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: githubAccessToken.refreshToken,
              })
            )(session)
        : TE.right(githubAccessToken.accessToken)
    )
  );

const getRepositories = (
  accessToken: string
): ((
  url: O.Option<string>
) => Promise<Either<NegativeGithubFetchOutcome, IRepository[]>>) =>
  O.fold(
    () => Promise.resolve(E.right([])),
    (someUrl) =>
      pipe(
        TE.tryCatch<NegativeGithubFetchOutcome, Response>(
          () =>
            fetch(someUrl, {
              headers: {
                Accept: "application/vnd.github.machine-man-preview+json",
                Authorization: `token ${accessToken}`,
              },
            }),
          (error): NegativeGithubFetchOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Call to github repo fetch failed",
            error,
          })
        ),
        TE.chain<NegativeGithubFetchOutcome, Response, Response>((res) =>
          res.ok
            ? TE.right(res)
            : TE.left({
                type: "REST_ENDPOINT_ERROR",
                msg: `Could not call github endpoint: ${res.status} ${res.statusText}`,
              })
        ),
        TE.chain<NegativeGithubFetchOutcome, Response, IRepository[]>(
          pipe(
            (res) =>
              TE.tryCatch<NegativeGithubFetchOutcome, any>(
                () => res.json(),
                (error) => ({
                  type: "UNDEFINED_ERROR",
                  msg: "Conversion of json response from github API failed",
                  error,
                })
              ),
            RTE.chain<
              Response,
              NegativeGithubFetchOutcome,
              any,
              { repositories: IRepository[] }
            >(
              flow(
                t.type({ repositories: t.array(Repository) }).decode,
                E.mapLeft(
                  (errors): NegativeGithubFetchOutcome => ({
                    type: "INCORRECT_TYPE_SAFETY",
                    msg: "Could not decode the github repositories",
                    errors,
                  })
                ),
                RTE.fromEither
              )
            ),
            RTE.chain<
              Response,
              NegativeGithubFetchOutcome,
              { repositories: IRepository[] },
              IRepository[]
            >(({ repositories }) => (res) =>
              TE.getApplySemigroup<NegativeGithubFetchOutcome, IRepository[]>(
                A.getMonoid<IRepository>()
              ).concat(TE.right(repositories), () =>
                getRepositories(accessToken)(nextFromResponse(res))
              )
            )
          )
        )
      )()
  );

const getInstallationRepositories = (
  accessToken: string
): ((
  url: O.Option<string>
) => Promise<Either<NegativeGithubFetchOutcome, IRepository[]>>) =>
  O.fold(
    () => Promise.resolve(E.right([])),
    (someUrl) =>
      pipe(
        TE.tryCatch(
          () =>
            fetch(someUrl, {
              headers: {
                Accept: "application/vnd.github.machine-man-preview+json",
                Authorization: `token ${accessToken}`,
              },
            }),
          (error): NegativeGithubFetchOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Call to github installation fetch failed",
            error,
          })
        ),
        TE.chain((res) =>
          res.ok
            ? TE.right(res)
            : TE.left({
                type: "REST_ENDPOINT_ERROR",
                msg: `Could not call github endpoint: ${res.status} ${res.statusText}`,
              })
        ),
        TE.chain(
          pipe(
            (res) =>
              TE.tryCatch<NegativeGithubFetchOutcome, any>(
                () => res.json(),
                (error) => ({
                  type: "UNDEFINED_ERROR",
                  msg: "Conversion of json response from github API failed",
                  error,
                })
              ),
            RTE.chain(
              flow(
                t.type({ installations: t.array(t.type({ id: t.number })) })
                  .decode,
                E.mapLeft(
                  (errors): NegativeGithubFetchOutcome => ({
                    type: "INCORRECT_TYPE_SAFETY",
                    msg: "Could not decode the github installations object",
                    errors,
                  })
                ),
                RTE.fromEither
              )
            ),
            RTE.chain<
              Response,
              NegativeGithubFetchOutcome,
              { installations: { id: number }[] },
              IRepository[]
            >(({ installations }) => (res) =>
              TE.getApplySemigroup<NegativeGithubFetchOutcome, IRepository[]>(
                A.getMonoid<IRepository>()
              ).concat(
                () =>
                  Promise.all(
                    installations.map(({ id }) =>
                      getRepositories(accessToken)(
                        O.some(
                          `https://api.github.com/user/installations/${id}/repositories`
                        )
                      )
                    )
                  ).then(M.fold(E.getApplyMonoid(A.getMonoid<IRepository>()))),
                () =>
                  getInstallationRepositories(accessToken)(
                    nextFromResponse(res)
                  )
              )
            )
          )
        )
      )()
  );
const nextFromResponse = (res: Response): O.Option<string> =>
  pipe(parseLinkHeader(res.headers.get("Link")), (linkh) =>
    !linkh || !linkh.next || !linkh.next.url ? O.none : O.some(linkh.next.url)
  );

export const getAllGhRepos = (
  session: ISession
): TE.TaskEither<NegativeGithubFetchOutcome, IRepository[]> =>
  pipe(
    fetchGithubAccessToken(session),
    TE.chain((accessToken) => () =>
      getInstallationRepositories(accessToken)(
        O.some("https://api.github.com/user/installations")
      )
    )
  );

const githubTokenType = t.type({
  refresh_token: t.string,
  access_token: t.string,
  expires_in: t.string,
  refresh_token_expires_in: t.string,
  token_type: t.string,
});
const githubIdQueryType = t.type({
  viewer: t.type({
    id: t.string,
  }),
});
type GithubTokenType = t.TypeOf<typeof githubTokenType>;
export const authenticateAppWithGithub = (
  userId: string,
  params: URLSearchParams
) => (session: ISession): TE.TaskEither<NegativeGithubFetchOutcome, string> =>
  pipe(
    TE.tryCatch(
      () =>
        fetch(process.env.GH_OAUTH_ACCESS_TOKEN_URL, {
          method: "post",
          body: params,
        }),
      (error): NegativeGithubFetchOutcome => ({
        type: "UNDEFINED_ERROR",
        msg: "Call to github failed",
        error,
      })
    ),
    TE.chain((res) =>
      res.ok
        ? TE.tryCatch(
            () => res.text().then(querystring.parse),
            (error) => ({
              type: "UNDEFINED_ERROR",
              msg: "Conversion of text response from github failed",
              error,
            })
          )
        : TE.left({
            type: "REST_ENDPOINT_ERROR",
            msg: `Could not call github endpoint: ${res.status} ${res.statusText}`,
          })
    ),
    TE.chainEitherK<
      NegativeGithubFetchOutcome,
      ParsedUrlQuery,
      GithubTokenType
    >((fromGh) =>
      pipe(
        fromGh,
        githubTokenType.decode,
        E.mapLeft(
          (errors): NegativeGithubFetchOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: `Could not decode the github token information: got ${JSON.stringify(
              fromGh
            )} ::: when using ${params.toString()}`,
            errors,
          })
        )
      )
    ),
    TE.chain((githubToken) =>
      TE.tryCatch(
        () =>
          new GraphQLClient("https://api.github.com/graphql", {
            headers: {
              authorization: `Bearer ${githubToken.access_token}`,
            },
          })
            .request(GITHUB_VIEWER_QUERY)
            .then((viewerResult) => ({ githubToken, viewerResult })),
        (error): NegativeGithubFetchOutcome => ({
          type: "UNDEFINED_ERROR",
          msg: "Call to github v4 api to get ID with token failed",
          error,
        })
      )
    ),
    TE.chainEitherK(({ viewerResult, githubToken }) =>
      pipe(
        viewerResult,
        githubIdQueryType.decode,
        E.mapLeft(
          (errors): NegativeGithubFetchOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not decode the id from github",
            errors,
          })
        ),
        E.chain((decodedViewerResult) =>
          E.right({ githubToken, viewerResult: decodedViewerResult })
        )
      )
    ),
    TE.chain(({ githubToken, viewerResult }) =>
      TE.right({
        githubToken,
        saltedEncryptedData: encrypt(
          JSON.stringify({
            accessToken: githubToken.access_token,
            refreshToken: githubToken.refresh_token,
            tokenType: githubToken.token_type,
            expiresAt:
              new Date().getTime() / MS_IN_SEC +
              parseInt(githubToken.expires_in),
            refreshTokenExpiresAt:
              new Date().getTime() / MS_IN_SEC +
              parseInt(githubToken.refresh_token_expires_in),
            nodeId: viewerResult.viewer.id,
          }),
          crypto.randomBytes(16),
          process.env.GH_TOKEN_SIGNING_KEY
        ),
      })
    ),
    TE.chain(({ githubToken, saltedEncryptedData }) =>
      TE.tryCatch(
        () =>
          upsertHack(
            session,
            CREATE_GITHUB_INFO_MUTATION,
            UPDATE_GITHUB_INFO_MUTATION,
            {
              userId: getUserIdFromIdOrEnv(userId),
              githubSyncChecksum: saltedEncryptedData.encryptedData,
              githubSyncNonce: saltedEncryptedData.iv,
            }
          ).then(() => githubToken),
        defaultGQLErrorHandler("insert github token mutation")
      )
    ),
    TE.chain(({ access_token }) => TE.right(access_token))
  );
