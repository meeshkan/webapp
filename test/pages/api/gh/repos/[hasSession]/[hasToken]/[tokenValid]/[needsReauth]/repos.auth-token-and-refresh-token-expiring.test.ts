process.env.GH_TOKEN_SIGNING_KEY = "this-token-is-32-characters-long";
import { mockAuth0WithSession } from "../../../../../../../../../mocks/auth0";
import {
  mockRequest,
  mockResponse,
} from "../../../../../../../../../mocks/reqres";
import { mockGraphqlRequestWithResolve } from "../../../../../../../../../mocks/graphql-request";
import { encrypt } from "../../../../../../../../../src/utils/sec";
import endpoint from "../../../../../../../../../src/pages/api/gh/repos";
import crypto from "crypto";
import * as E from "fp-ts/lib/Either";

const token = encrypt(
  JSON.stringify({
    accessToken: "my-access-token",
    refreshToken: "my-refresh-token",
    tokenType: "bearer",
    expiresAt: Math.floor(new Date().getTime() / 1000),
    refreshTokenExpiresAt: Math.floor(new Date().getTime() / 1000), // will need new refresh token
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

test("endpoint returns INCORRECT_TYPE_SAFETY with token decoding error message when 8base returns an encryption token that does not conform to the spec", () =>
  expect(
    endpoint(mockRequest(), mockResponse()).then(
      E.mapLeft(({ type }) => ({ type }))
    )
  ).resolves.toEqual(
    E.left({
      type: "NEEDS_REAUTH",
    })
  ));
