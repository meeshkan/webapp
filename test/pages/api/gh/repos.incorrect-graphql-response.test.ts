///////// setup
// auth0
jest.mock("../../../../src/utils/auth0");
const auth0 = require("../../../../src/utils/auth0");
auth0.default.mockImplementation(() => ({
  getSession: () =>
    Promise.resolve({
      idToken: "mock-id-token",
      user: {
        email: "mock@email.com",
        picture: "https://mock-picture.io/me",
      },
    }),
}));
// graphql request with incorrect type safety
jest.mock("graphql-request");
const gqlr = require("graphql-request");

gqlr.GraphQLClient.mockImplementation(() => ({
  // FORCE INCORRECT TYPE SAFETY with dummy response
  request: () => Promise.resolve(0),
}));

// request and response
import { NextApiRequest, NextApiResponse } from "next";
const mockRequest = {} as NextApiRequest;
// @ts-ignore
const mockResponse = { status: jest.fn(), end: jest.fn() } as NextApiResponse;

//////////////////// the test
import endpoint from "../../../../src/pages/api/gh/repos";
import * as E from "fp-ts/lib/Either";

test("endpoint returns null without any additional mocking", () =>
  expect(
    endpoint(mockRequest, mockResponse).then(E.mapLeft((e) => e.type))
  ).resolves.toEqual(E.left("INCORRECT_TYPE_SAFETY")));
