///////// setup
// auth0
jest.mock("../../../../src/utils/auth0");
const auth0 = require("../../../../src/utils/auth0");
auth0.default.mockImplementation(() => ({
  getSession: () => Promise.resolve(null),
}));

////// request response

const mockRequest = {} as NextApiRequest;
// @ts-ignore
const mockResponse = { status: jest.fn(), end: jest.fn() } as NextApiResponse;

import endpoint from "../../../../src/pages/api/gh/repos";
import { NextApiRequest, NextApiResponse } from "next";
import * as E from "fp-ts/lib/Either";

test("endpoint returns null without any additional mocking", () =>
  expect(endpoint(mockRequest, mockResponse)).resolves.toEqual(
    E.left({
      msg: "Session is null in: repos.ts default export",
      type: "NOT_LOGGED_IN",
    })
  ));
