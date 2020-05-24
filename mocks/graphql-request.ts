jest.mock("graphql-request");
const Resolve: unique symbol = Symbol();
type Resolve = typeof Resolve;
const Reject: unique symbol = Symbol();
type Reject = typeof Reject;

type Req = {
  data: any;
  action: Resolve | Reject;
};

export const mockGraphqlRequestWithResolve = (u: any) =>
  mockGraphqlRequestWithResolves([u]);

export const mockGraphqlRequestWithReject = (u: any) =>
  mockGraphqlRequestWithRejects([u]);

export const mockGraphqlRequestWithResolves = (u: any[]) =>
  mockGraphqlRequest(u.map((i) => ({ action: Resolve, data: i })));

export const mockGraphqlRequestWithRejects = (u: any[]) =>
  mockGraphqlRequest(u.map((i) => ({ action: Reject, data: i })));

export const mockGraphqlRequest = (u: Req[]) => {
  const gqlr = require("graphql-request");
  gqlr.GraphQLClient.mockClear();
  gqlr.GraphQLClient.mockImplementation(() => ({
    request: u.reduce(
      (a: jest.Mock<any, any>, b) =>
        a.mockReturnValueOnce(
          b.action === Resolve
            ? Promise.resolve(b.data)
            : Promise.reject(b.data)
        ),
      jest.fn()
    ),
  }));
};
