process.env.GH_TOKEN_SIGNING_KEY = "abcdabcdabcdabcdabcdabcdabcdabcd";
import { mockAuth0WithSession } from "../../../../../../../../mocks/auth0";
import {
  mockRequest,
  mockResponse,
} from "../../../../../../../../mocks/reqres";
import { mockGraphqlRequestWithResolve } from "../../../../../../../../mocks/graphql-request";
import { encrypt } from "../../../../../../../../src/utils/sec";
import endpoint from "../../../../../../../../src/pages/api/gh/repos";
import crypto from "crypto";
import * as E from "fp-ts/lib/Either";

const token = encrypt(
  JSON.stringify({ corrupted: "token", without: "any", sensible: "values" }),
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
      E.mapLeft(({ type, msg }) => ({ type, msg }))
    )
  ).resolves.toEqual(
    E.left({
      type: "INCORRECT_TYPE_SAFETY",
      msg: "Could not decode the token from the graphql endpoint",
    })
  ));
