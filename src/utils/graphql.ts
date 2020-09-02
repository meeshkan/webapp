import * as t from "io-ts";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { withX } from "./with";
import { GraphQLClient } from "graphql-request";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { getTokenFromSessionOrEnv } from "../pages/api/session";

export const gqlOperatorName = (b: string) =>
  JSON.parse(b)["query"].startsWith("mutation")
    ? "MUTATION"
    : JSON.parse(b)["query"].startsWith("subscription")
    ? "SUBSCRIPTION"
    : "QUERY";

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

export const eightBaseClient = (session: ISession) =>
  new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
    headers: {
      authorization: `Bearer ${getTokenFromSessionOrEnv(session)}`,
    },
  });

export const upsertHack = (
  session: ISession,
  createCmd: string,
  updateCmd: string,
  vars: any
) =>
  eightBaseClient(session)
    .request(createCmd, vars)
    .then(
      (a) => a,
      () => eightBaseClient(session).request(updateCmd, vars)
    );

export const withClient = <E, A>(session: ISession) =>
  withX<E, GraphQLClient, E, A>(pipe(session, eightBaseClient, TE.right));
