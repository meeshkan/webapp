import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { GraphQLClient } from "graphql-request";
import * as t from "io-ts";
import fetch from "isomorphic-unfetch";
import { hookNeedingFetch } from "./hookNeedingFetch";
import { flow } from "fp-ts/lib/function";
import { Lens } from "monocle-ts";

export type NotAuthorized = "NotAuthorized";
export const NotAuthorized: NotAuthorized = "NotAuthorized";

export const fetchSession = async (): Promise<
  E.Either<NotAuthorized, ISession>
> => {
  const res = await fetch("/api/session");
  const session = res.ok ? await res.json() : null;
  return session ? E.right(session) : E.left(NotAuthorized);
};

export const useFetchSession = () => hookNeedingFetch(fetchSession);

export interface INCORRECT_TYPE_SAFETY {
  type: "INCORRECT_TYPE_SAFETY";
  errors: t.Errors;
}

export interface UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
  error: Error;
}

export type NegativeConfirmOrCreateUserOutcome =
  | INCORRECT_TYPE_SAFETY
  | UNDEFINED_ERROR;

export const INCORRECT_TYPE_SAFETY = (
  errors: t.Errors
): NegativeConfirmOrCreateUserOutcome => ({
  type: "INCORRECT_TYPE_SAFETY",
  errors,
});

export const UNDEFINED_ERROR = (error: Error): NegativeConfirmOrCreateUserOutcome => ({
  type: "UNDEFINED_ERROR",
  error,
});

const __confirmOrCreateUser = <A, B, Session extends { idToken?: string, user: any}>(
  query: string,
  vars: Record<string, any>,
  tp: t.Type<B, B, unknown>,
  getter: (b: B) => A,
  session: Session
): TE.TaskEither<NegativeConfirmOrCreateUserOutcome, A> =>
  pipe(
    TE.tryCatch(
      () =>
        new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
          headers: {
            authorization: `Bearer ${session.idToken}`,
          },
        }).request(query, vars),
      UNDEFINED_ERROR
    ),
    TE.chainEitherK(flow(tp.decode, E.mapLeft(INCORRECT_TYPE_SAFETY))),
    TE.chainEitherK(flow(getter, E.right))
  );

export const confirmOrCreateUser = <A, Session extends { idToken?: string, user: any}>(
  query: string,
  tp: t.Type<A, A, unknown>
) => (
  session: Session
): Promise<E.Either<NegativeConfirmOrCreateUserOutcome, A>> =>
  pipe(
    __confirmOrCreateUser(
      `query {
        user {
          ${query}
        }
      }`,
      {},
      t.type({ user: tp }),
      Lens.fromProp<{ user: A }>()("user").get,
      session
    ),
    TE.fold(
      () =>
        __confirmOrCreateUser(
          `mutation (
        $user: UserCreateInput!,
        $authProfileId: ID!
      ) {
        userSignUpWithToken(
          user: $user,
          authProfileId: $authProfileId
        ) {
          ${query}
        }
      }`,
          {
            user: {
              email: session.user.email,
            },
            authProfileId: process.env.EIGHT_BASE_AUTH_PROFILE_ID,
          },
          t.type({ userSignUpWithToken: tp }),
          Lens.fromProp<{ userSignUpWithToken: A }>()("userSignUpWithToken")
            .get,
          session
        ),
      TE.right
    )
  )();