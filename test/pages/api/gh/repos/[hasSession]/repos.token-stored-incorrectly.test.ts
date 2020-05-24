import { mockAuth0WithSession } from "../../../../../../mocks/auth0";
import { mockRequest, mockResponse } from "../../../../../../mocks/reqres";
import { mockGraphqlRequestWithResolve } from "../../../../../../mocks/graphql-request";

import endpoint from "../../../../../../src/pages/api/gh/repos";
import * as E from "fp-ts/lib/Either";

mockAuth0WithSession();
mockGraphqlRequestWithResolve({ this: "is", incorrectly: "typed" });

test("endpoint returns INCORRECT_TYPE_SAFETY when 8base returns incorrectly-typed data", () =>
  expect(
    endpoint(mockRequest(), mockResponse()).then(E.mapLeft(({ type }) => type))
  ).resolves.toEqual(E.left("INCORRECT_TYPE_SAFETY")));
