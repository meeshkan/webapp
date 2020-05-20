jest.mock("isomorphic-fetch");

type MockRes = {
  headers: Record<string, string>;
  body: string;
  ok: boolean;
}

export const mockFetchWithResult = ({ headers, body, ok }: MockRes) => {
  const fetch = require("isomorphic-fetch");
  fetch.mockClear();
  fetch.mockImplementation(() => Promise.resolve({
    headers,
    json: Promise.resolve(JSON.parse(body)),
    text: Promise.resolve(body),
    ok
  }));
};
