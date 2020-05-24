process.env.GH_TOKEN_SIGNING_KEY = "this-token-is-32-characters-long";
process.env.GH_OAUTH_ACCESS_TOKEN_URL = "https://api.github.com/oauth";
import { mockAuth0WithSession } from "../../../../../../../../../../../../mocks/auth0";
import {
  mockRequest,
  mockResponse,
} from "../../../../../../../../../../../../mocks/reqres";
import {
  mockGraphqlRequestWithResolve,
  mockGraphqlRequestWithResolves,
} from "../../../../../../../../../../../../mocks/graphql-request";
import { encrypt } from "../../../../../../../../../../../../src/utils/sec";
import endpoint from "../../../../../../../../../../../../src/pages/api/gh/repos";
import crypto from "crypto";
import nock from "nock";
import * as E from "fp-ts/lib/Either";
nock("https://api.github.com")
  .post("/oauth")
  .reply(
    200,
    "refresh_token=my-rt&access_token=my-at&expires_in=50&refresh_token_expires_in=50&token_type=bearer"
  );

const token = encrypt(
  JSON.stringify({
    accessToken: "my-access-token",
    refreshToken: "my-refresh-token",
    tokenType: "bearer",
    expiresAt: Math.floor(new Date().getTime() / 1000) + 15, // will need reauth
    refreshTokenExpiresAt: Math.floor(new Date().getTime() / 1000) + 1000,
    nodeId: "R2D2",
  }),
  crypto.randomBytes(16)
);

mockAuth0WithSession();
mockGraphqlRequestWithResolves([
  {
    user: {
      id: "my-id",
      githubInfo: {
        githubSyncChecksum: token.encryptedData,
        githubSyncNonce: token.iv,
      },
    },
  },
  {
    incorrect: {
      type: "safety",
    },
  },
]);

test("endpoint returns INCORRECT_TYPE_SAFETY when github returns malformed graphql response", () =>
  expect(
    endpoint(mockRequest(), mockResponse()).then(
      E.mapLeft(({ type, msg }) => ({ type, msg }))
    )
  ).resolves.toEqual(
    E.left({
      type: "INCORRECT_TYPE_SAFETY",
      msg: "Could not decode the id from github",
    })
  ));
