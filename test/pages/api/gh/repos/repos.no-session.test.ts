import { mockAuth0WithNoSession } from "../../../../../mocks/auth0";
import { mockRequest, mockResponse } from "../../../../../mocks/reqres";

import endpoint from "../../../../../src/pages/api/gh/repos";
import * as E from "fp-ts/lib/Either";

mockAuth0WithNoSession();

test("endpoint returns NOT_LOGGED_IN when there is no session", () =>
  expect(
    endpoint(mockRequest(), mockResponse()).then(E.mapLeft(({ type }) => type))
  ).resolves.toEqual(E.left("NOT_LOGGED_IN")));
