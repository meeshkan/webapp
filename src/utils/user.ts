import React from "react";
import fetch from "isomorphic-unfetch";
import hookNeedingFetch from "./hookNeedingFetch";
import { GraphQLClient } from "graphql-request";

export const fetchUser = async () => {
  const res = await fetch("/api/me");
  const user = res.ok ? await res.json() : null;
  return user;
};

export const useFetchUser = () => hookNeedingFetch(fetchUser);

export const confirmOrCreateUser = async (query, auth0IdToken, email) => {
  const _8baseUserClient = new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
      headers: {
        authorization: `Bearer ${auth0IdToken}`,
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
    return user;
  } catch {
    const _8baseAdminClient = new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
        headers: {
          authorization: `Bearer ${process.env.EIGHT_BASE_CREATE_USER_TOKEN}`,
        },
    });
    const { userSignUpWithToken } = await _8baseAdminClient.request(`mutation (
      $user: UserCreateInput!,
      $authProfileId: ID!
    ) {
      userSignUpWithToken(
        user: $user,
        authProfileId: $authProfileId
      ) {
        ${query}
      }
    }`, {
      user: {
        email
      },
      authProfileId: process.env.EIGHT_BASE_AUTH_PROFILE_ID
    });
    return userSignUpWithToken;
  }
}
