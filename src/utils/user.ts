import React from "react";
import fetch from "isomorphic-unfetch";
import { hookNeedingFetch } from "./hookNeedingFetch";
import { GraphQLClient } from "graphql-request";
import { Either, left, right } from "fp-ts/lib/Either";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";

export type NotAuthorized = "NotAuthorized";
export const NotAuthorized: NotAuthorized  = "NotAuthorized";


export const fetchSession = async (): Promise<Either<NotAuthorized,ISession>> => {
  console.log("fetching session");
  const res = await fetch("/api/session");
  const session = res.ok ? await res.json() : null;
  return session ? right(session) : left(NotAuthorized);
};

export const useFetchSession = () => hookNeedingFetch(fetchSession);

enum NegativeConfirmOrCreateUserOutcome {
  INCORRECT_TYPE_SAFETY,
}

export const confirmOrCreateUser = async <T>(
  query: string,
  session: ISession,
  typeSafe: (u: unknown) => u is T
): Promise<Either<NegativeConfirmOrCreateUserOutcome, T>> => {
  const _8baseUserClient = new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
    headers: {
      authorization: `Bearer ${session.idToken}`,
    },
  });
  // this uses the flow described on
  // https://docs.8base.com/docs/8base-console/authentication#3-user-query
  // it is a bit hackish because it relies on global exceptions as a form of
  // control logic, but as it is their recommendation, we use it
  // the cleaner way would be to have a more fine-grained exception or
  // an isAuth query we could run that did not raise an exception
  try {
    const { user } = await _8baseUserClient.request(`query {
      user {
        ${query}
      }
    }`);
    return typeSafe(user)
      ? right(user)
      : (() => {console.error(`Could not perform a typesafe cast of ${user}`); return left(NegativeConfirmOrCreateUserOutcome.INCORRECT_TYPE_SAFETY)})();
  } catch {
    try {
      const { userSignUpWithToken } = await _8baseUserClient.request(
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
        }
      );
      return typeSafe(userSignUpWithToken)
        ? right(userSignUpWithToken)
        : (() => {console.error(`Could not perform a typesafe cast of ${userSignUpWithToken}`); return left(NegativeConfirmOrCreateUserOutcome.INCORRECT_TYPE_SAFETY)})();
      } catch (e) {
      console.error("Could not register user with the following session", session, e.response.errors);
      throw e;
    }
  }
};
