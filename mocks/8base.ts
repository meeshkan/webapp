jest.mock("graphql-request");
export const mock8BaseWithResult = (u: unknown) => {
  const gqlr = require("graphql-request");
  gqlr.GraphQLClient.mockClear();
  gqlr.GraphQLClient.mockImplementation(() => ({
    request: () => Promise.resolve(u),
  }));
};
