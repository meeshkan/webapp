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
import * as _RTE from "../fp-ts/ReaderTaskEither";
import * as _TE from "../fp-ts/TaskEither";
import { defaultGQLErrorHandler, INCORRECT_TYPE_SAFETY, INVALID_TOKEN_ERROR, NEEDS_REAUTH, NO_TOKEN_YET, OAUTH_FLOW_ERROR, REST_ENDPOINT_ERROR, UNDEFINED_ERROR } from "./error";
import { decrypt, encrypt } from "./sec";
import { confirmOrCreateUser } from "./user";

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
export const fetchGithubAccessToken = async (
  session: ISession
): Promise<Either<NegativeGithubFetchOutcome, string>> =>
  pipe(
    _TE.tryToEitherCatch(
      () =>
        confirmOrCreateUser(
          `id
    githubInfo {
      githubSyncChecksum
      githubSyncNonce
    }`,
          githubAccessTokenType
        )(session),
      (error): NegativeGithubFetchOutcome => ({
        type: "UNDEFINED_ERROR",
        msg: "Could not fetch access token from gql endpoint",
        error,
      })
    ),
    TE.chain((githubAccessToken) =>
      githubAccessToken.githubInfo === null
        ? TE.left({ type: "NO_TOKEN_YET", msg: "No token currently in db" })
        : TE.right(githubAccessToken)
    ),
    // JSON.parse is an unsafe operation, we probably want an
    // additional check at some point
    TE.chain(({ id, githubInfo }) =>
      TE.right({
        id,
        githubAccessToken: JSON.parse(
          decrypt({
            iv: githubInfo.githubSyncNonce,
            encryptedData: githubInfo.githubSyncChecksum,
          })
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
          ? TE.left({ type: "NEEDS_REAUTH", msg: "Refresh token expires soon" })
          : _TE.tryToEitherCatch(
              () =>
                authenticateAppWithGithub(
                  id,
                  new URLSearchParams({
                    client_id: process.env.GH_OAUTH_APP_CLIENT_ID,
                    client_secret: process.env.GH_OAUTH_APP_CLIENT_SECRET,
                    grant_type: "refresh_token",
                    refresh_token: githubAccessToken.refreshToken,
                  })
                )(session),
              (error): NegativeGithubFetchOutcome => ({
                type: "UNDEFINED_ERROR",
                msg: "Unexpected error when renewing token from access token",
                error,
              })
            )
        : TE.right(githubAccessToken.accessToken)
    )
  )();

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
            msg: "Call to github repo fetch failedfailed",
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
            _RTE.tryCatch<Response, NegativeGithubFetchOutcome, any>(
              (res) => res.json(),
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
            _RTE.chainWithAsk<
              Response,
              NegativeGithubFetchOutcome,
              { repositories: IRepository[] },
              IRepository[]
            >(({ repositories }) => (res) =>
              RTE.getApplySemigroup<
                Response,
                NegativeGithubFetchOutcome,
                IRepository[]
              >(A.getMonoid<IRepository>()).concat(
                RTE.right(repositories),
                RTE.fromTaskEither(() =>
                  getRepositories(accessToken)(nextFromResponse(res))
                )
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
            msg: "Call to github repo fetch failedfailed",
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
            _RTE.tryCatch<Response, NegativeGithubFetchOutcome, any>(
              (res) => res.json(),
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
            _RTE.chainWithAsk<
              Response,
              NegativeGithubFetchOutcome,
              { installations: { id: number }[] },
              IRepository[]
            >(({ installations }) => (res) =>
              RTE.getApplySemigroup<
                Response,
                NegativeGithubFetchOutcome,
                IRepository[]
              >(A.getMonoid<IRepository>()).concat(
                RTE.fromTaskEither(() =>
                  Promise.all(
                    installations.map(({ id }) =>
                      getRepositories(accessToken)(
                        O.some(
                          `https://api.github.com/user/installations/${id}/repositories`
                        )
                      )
                    )
                  ).then(M.fold(E.getApplyMonoid(A.getMonoid<IRepository>())))
                ),
                RTE.fromTaskEither(() =>
                  getInstallationRepositories(accessToken)(
                    nextFromResponse(res)
                  )
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
): Promise<Either<NegativeGithubFetchOutcome, IRepository[]>> =>
  pipe(
    _TE.tryToEitherCatch(
      () => fetchGithubAccessToken(session),
      (error): NegativeGithubFetchOutcome => ({
        type: "UNDEFINED_ERROR",
        msg: "Unexpected Error returning access token",
        error,
      })
    ),
    TE.chain((accessToken) => () =>
      getInstallationRepositories(accessToken)(
        O.some("https://api.github.com/user/installations")
      )
    )
  )();

const githubTokenType = t.type({
  refresh_token: t.string,
  access_token: t.string,
  expires_in: t.number,
  refresh_token_expires_in: t.number,
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
) => async (
  session: ISession
): Promise<Either<NegativeGithubFetchOutcome, string>> =>
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
    >(
      flow(
        githubTokenType.decode,
        E.mapLeft(
          (errors): NegativeGithubFetchOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not decode the github token information",
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
            .request(
              `query {
      viewer {
        id
      }
    }`
            )
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
              githubToken.expires_in,
            refreshTokenExpiresAt:
              new Date().getTime() / MS_IN_SEC +
              githubToken.refresh_token_expires_in,
            nodeId: viewerResult.viewer.id,
          }),
          crypto.randomBytes(16)
        ),
      })
    ),
    TE.chain(({ githubToken, saltedEncryptedData }) =>
      pipe(
        TE.tryCatch(
          () =>
            new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
              headers: {
                authorization: `Bearer ${session.idToken}`,
              },
            })
              .request(
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
                  githubSyncChecksum: saltedEncryptedData.encryptedData,
                  githubSyncNonce: saltedEncryptedData.iv,
                }
              )
              .then(() => githubToken),
          (error): NegativeGithubFetchOutcome =>
            defaultGQLErrorHandler("insert github token mutation")(error)
        ),
        TE.fold(
          () =>
            TE.tryCatch(
              () =>
                new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
                  headers: {
                    authorization: `Bearer ${session.idToken}`,
                  },
                })
                  .request(
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
                      githubSyncChecksum: saltedEncryptedData.encryptedData,
                      githubSyncNonce: saltedEncryptedData.iv,
                    }
                  )
                  .then(() => githubToken),
              (error): NegativeGithubFetchOutcome =>
                defaultGQLErrorHandler("insert github token mutation")(error)
            ),
          TE.right
        )
      )
    ),
    TE.chain(({ access_token }) => TE.right(access_token))
  )();
