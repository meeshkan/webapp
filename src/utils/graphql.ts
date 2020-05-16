import * as t from "io-ts";

export const errors = t.type({
  errors: t.array(
    t.type({
      code: t.string,
    })
  ),
});

export const gqlRequestError = t.type({
    response: errors
});