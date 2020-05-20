import { mockAuth0WithSession } from "../../../../mocks/auth0";
import { mockRequest, mockResponse } from "../../../../mocks/reqres";
import { mock8BaseWithResult } from "../../../../mocks/8base";

import endpoint from "../../../../src/pages/api/gh/repos";
import * as E from "fp-ts/lib/Either";

mockAuth0WithSession();
mock8BaseWithResult(0);

test("endpoint returns null without any additional mocking", () =>
  expect(
    endpoint(mockRequest(), mockResponse()).then(E.mapLeft((e) => e.type))
  ).resolves.toEqual(E.left("INCORRECT_TYPE_SAFETY")));
