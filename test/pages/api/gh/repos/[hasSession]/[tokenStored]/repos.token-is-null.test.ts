import { mockAuth0WithSession } from "../../../../../../../mocks/auth0";
import { mockRequest, mockResponse } from "../../../../../../../mocks/reqres";
import { mockGraphqlRequestWithResolve } from "../../../../../../../mocks/graphql-request";

import endpoint from "../../../../../../../src/pages/api/gh/repos";
import * as E from "fp-ts/lib/Either";

mockAuth0WithSession();
mockGraphqlRequestWithResolve({ user: { id: "my-id", githubInfo: null } });

test("endpoint returns NO_TOKEN_YET when 8base returns a user that does not have a token", () =>
  expect(
    endpoint(mockRequest(), mockResponse()).then(E.mapLeft(({ type }) => type))
  ).resolves.toEqual(E.left("NO_TOKEN_YET")));
