process.env.GH_TOKEN_SIGNING_KEY = "abcdabcdabcdabcdabcdabcdabcdabcd";
process.env.GH_OAUTH_ACCESS_TOKEN_URL = "https://api.github.com/oauth";
import { mockAuth0WithSession } from "../../../../../../../../../../mocks/auth0";
import {
  mockRequest,
  mockResponse,
} from "../../../../../../../../../../mocks/reqres";
import { mockGraphqlRequestWithResolve } from "../../../../../../../../../../mocks/graphql-request";
import { encrypt } from "../../../../../../../../../../src/utils/sec";
import endpoint from "../../../../../../../../../../src/pages/api/gh/repos";
import crypto from "crypto";
import unmock, { u } from "unmock";
import * as E from "fp-ts/lib/Either";

unmock.nock("https://api.github.com").post("/oauth").reply(400, u.string());
beforeAll(() => unmock.on());
afterAll(() => unmock.off());

const token = encrypt(
  JSON.stringify({
    accessToken: "my-access-token",
    refreshToken: "my-refresh-token",
    tokenType: "bearer",
    expiresAt: Math.floor(new Date().getTime() / 1000),
    refreshTokenExpiresAt: Math.floor(new Date().getTime() / 1000) + 1000,
    nodeId: "R2D2",
  }),
  crypto.randomBytes(16),
  process.env.GH_TOKEN_SIGNING_KEY
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

test("endpoint returns REST_ENDPOINT_ERROR when github oauth token exchange returns 400", () =>
  expect(
    endpoint(mockRequest(), mockResponse()).then(
      E.mapLeft(({ type }) => ({ type }))
    )
  ).resolves.toEqual(
    E.left({
      type: "REST_ENDPOINT_ERROR",
    })
  ));
