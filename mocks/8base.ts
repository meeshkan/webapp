jest.mock("graphql-request");
export const mock8BaseWithResult = (u: unknown) => {
  const gqlr = require("graphql-request");
  gqlr.GraphQLClient.mockClear();
  gqlr.GraphQLClient.mockImplementation(() => ({
    request: () => Promise.resolve(u),
  }));
};
export const mock8BaseWithResults = (u: unknown[]) => {
  const gqlr = require("graphql-request");
  gqlr.GraphQLClient.mockClear();
  gqlr.GraphQLClient.mockImplementation(() => ({
    request: u.reduce(
      (a: jest.Mock<any, any>, b) => a.mockReturnValueOnce(b),
      jest.fn()
    ),
  }));
};
