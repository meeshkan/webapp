import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import fetch from "isomorphic-unfetch";
import { Lens } from "monocle-ts";
import { INCORRECT_TYPE_SAFETY, UNDEFINED_ERROR } from "./error";
import { eightBaseClient } from "./graphql";
import { hookNeedingFetch } from "./hookNeedingFetch";

export type NotAuthorized = "NotAuthorized";
export const NotAuthorized: NotAuthorized = "NotAuthorized";

export const fetchSession: TE.TaskEither<NotAuthorized, ISession> = () =>
  fetch("/api/session")
    .then((res) => (res.ok ? res.json() : null))
    .then((session) => (session ? E.right(session) : E.left(NotAuthorized)));

export const useFetchSession = () => hookNeedingFetch(fetchSession);

export type NegativeConfirmOrCreateUserOutcome =
  | INCORRECT_TYPE_SAFETY
  | UNDEFINED_ERROR;

const __confirmOrCreateUser = <A, B, Session extends ISession>(
  query: string,
  vars: Record<string, any>,
  tp: t.Type<B, B, unknown>,
  getter: (b: B) => A,
  isConfirm: boolean,
  session: Session
): TE.TaskEither<NegativeConfirmOrCreateUserOutcome, A> =>
  pipe(
    // attempt graphql operation
    TE.tryCatch(
      () => eightBaseClient(session).request(query, vars),
      (error): NegativeConfirmOrCreateUserOutcome => ({
        type: "UNDEFINED_ERROR",
        msg: `Could not ${isConfirm ? "confirm" : "create"} user`,
        error,
      })
    ),
    TE.chainEitherK(
      // try to decode using the incoming type
      // and report an error if we can't
      flow(
        tp.decode,
        E.mapLeft(
          (errors): NegativeConfirmOrCreateUserOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: `Type error on response while ${
              isConfirm ? "confirming" : "creating"
            } user`,
            errors,
          })
        )
      )
    ),
    // use a getter to get the outcome from the toplevel result
    // for example, if the result is { user: { id: "a" } }, a getter
    // could be (res) => res.user with would yield { id: "a" }
    TE.chainEitherK(flow(getter, E.right))
  );

export const confirmOrCreateUser = <A, Session extends ISession>(
  query: string,
  tp: t.Type<A, A, unknown>
) => (session: Session): TE.TaskEither<NegativeConfirmOrCreateUserOutcome, A> =>
  pipe(
    // attempt to confirm the euser
    __confirmOrCreateUser(
      `query {
        user {
          ${query}
        }
      }`,
      {},
      t.type({ user: tp }),
      Lens.fromProp<{ user: A }>()("user").get,
      true,
      session
    ),
    TE.fold(
      // if not successful, attempt to create the user
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
          false,
          session
        ),
      // if successful, return as is (meaning the right of an either)
      TE.right
    )
  );
