process.env.GH_TOKEN_SIGNING_KEY = "this-token-is-32-characters-long";
process.env.GH_OAUTH_ACCESS_TOKEN_URL = "https://api.github.com/oauth";
import { mockAuth0WithSession } from "../../../../../../../../../../../mocks/auth0";
import {
  mockRequest,
  mockResponse,
} from "../../../../../../../../../../../mocks/reqres";
import { mockGraphqlRequestWithResolve } from "../../../../../../../../../../../mocks/graphql-request";
import { encrypt } from "../../../../../../../../../../../src/utils/sec";
import endpoint from "../../../../../../../../../../../src/pages/api/gh/repos";
import crypto from "crypto";
import unmock, { u } from "unmock";
import * as E from "fp-ts/lib/Either";

unmock
  .nock("https://api.github.com")
  .post("/oauth")
  .reply(200, u.string());
unmock.on();

const token = encrypt(
  JSON.stringify({
    accessToken: "my-access-token",
    refreshToken: "my-refresh-token",
    tokenType: "bearer",
    expiresAt: Math.floor(new Date().getTime() / 1000),
    refreshTokenExpiresAt: Math.floor(new Date().getTime() / 1000) + 1000,
    nodeId: "R2D2",
  }),
  crypto.randomBytes(16)
);

mockAuth0WithSession();
mockGraphqlRequestWithResolve({
  user: {
    id: "my-id",
    githubInfo: {
      githubSyncChecksum: token.encryptedData,
      githubSyncNonce: token.iv,
    },
  },
});

test("endpoint returns INCORRECT_TYPE_SAFETY when github returns 200 with bad querystring", () =>
  expect(
    endpoint(mockRequest(), mockResponse()).then(
      E.mapLeft(({ type }) => ({ type }))
    )
  ).resolves.toEqual(
    E.left({
      type: "INCORRECT_TYPE_SAFETY",
    })
  ));
