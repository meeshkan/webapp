import React from "react";
import fetch from "isomorphic-unfetch";
import hookNeedingFetch from "./hookNeedingFetch";
import { GraphQLClient } from "graphql-request";
import { Either, left, right } from "fp-ts/lib/Either";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";

export const fetchUser = async () => {
  const res = await fetch("/api/me");
  const user = res.ok ? await res.json() : null;
  return user;
};

export const useFetchUser = () => hookNeedingFetch(fetchUser);

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
      : left(NegativeConfirmOrCreateUserOutcome.INCORRECT_TYPE_SAFETY);
  } catch {
    const _8baseAdminClient = new GraphQLClient(
      process.env.EIGHT_BASE_ENDPOINT,
      {
        headers: {
          authorization: `Bearer ${process.env.EIGHT_BASE_CREATE_USER_TOKEN}`,
        },
      }
    );
    try {
      const { userSignUpWithToken } = await _8baseAdminClient.request(
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
        : left(NegativeConfirmOrCreateUserOutcome.INCORRECT_TYPE_SAFETY);
    } catch (e) {
      console.error("BAD", session, session.user);
      throw e;
    }
  }
};
