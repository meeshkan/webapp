import * as t from "io-ts";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { withX } from "./with";
import { GraphQLClient } from "graphql-request";
import * as TE from "fp-ts/lib/TaskEither";

export const errors = t.type({
  errors: t.array(
    t.type({
      code: t.string,
    })
  ),
});

export const gqlRequestError = t.type({
  response: errors,
});

export const withClient = <E, A>(session: ISession) =>
  withX<E, GraphQLClient, E, A>(
    TE.right(
      new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
        headers: {
          authorization: `Bearer ${session.idToken}`,
        },
      })
    )
  );
