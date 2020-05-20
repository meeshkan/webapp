jest.mock("../src/utils/auth0");
export const mockAuth0WithSession = () => {
  const auth0 = require("../src/utils/auth0");
  auth0.default.mockClear();
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
};

export const mockAuth0WithNoSession = () => {
  const auth0 = require("../src/utils/auth0");
  auth0.default.mockClear();
  auth0.default.mockImplementation(() => ({
    getSession: () => Promise.resolve(null),
  }));
};
