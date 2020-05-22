import * as t from "io-ts";
import { gqlRequestError } from "./graphql";

export interface INCORRECT_TYPE_SAFETY {
  type: "INCORRECT_TYPE_SAFETY";
  msg: string;
  errors: t.Errors;
}
export interface UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
  msg: string;
  error: unknown;
}
export interface NOT_LOGGED_IN {
  type: "NOT_LOGGED_IN";
  msg: string;
}
export interface INVALID_TOKEN_ERROR {
  type: "INVALID_TOKEN_ERROR";
  msg: string;
}
export interface REST_ENDPOINT_ERROR {
  type: "REST_ENDPOINT_ERROR";
  msg: string;
}
export interface OAUTH_FLOW_ERROR {
  type: "OAUTH_FLOW_ERROR";
  msg: string;
}
export interface NO_TOKEN_YET {
  type: "NO_TOKEN_YET";
  msg: string;
}
export interface NEEDS_REAUTH {
  type: "NEEDS_REAUTH";
  msg: string;
}
export interface TEAM_DOES_NOT_EXIST {
  type: "TEAM_DOES_NOT_EXIST";
  msg: string;
}
export interface TEST_DOES_NOT_EXIST {
  type: "TEST_DOES_NOT_EXIST";
  msg: string;
}
export interface USER_HAS_TEAMS {
  type: "USER_HAS_TEAMS";
  msg: string;
}
export interface ID_NOT_IN_STATE {
  type: "ID_NOT_IN_STATE";
  msg: string;
}
export interface PROJECT_DOES_NOT_EXIST {
  type: "PROJECT_DOES_NOT_EXIST";
  msg: string;
}
export const defaultGQLErrorHandler = (ctx: string) => (
  error: unknown
): INVALID_TOKEN_ERROR | UNDEFINED_ERROR =>
  gqlRequestError.is(error) &&
  error.response.errors.filter((err) => err.code === "InvalidTokenError")
    .length > 0
    ? {
        type: "INVALID_TOKEN_ERROR",
        msg: `Incorrect token for the graphql api when in context: ${ctx}`,
      }
    : {
        type: "UNDEFINED_ERROR",
        msg: `Undefined error in graphql call when in context; ${ctx}`,
        error,
      };

export interface LENS_ACCESSOR_ERROR {
  type: "LENS_ACCESSOR_ERROR";
  msg: string;
}

export interface GET_SERVER_SIDE_PROPS_ERROR {
  type: "GET_SERVER_SIDE_PROPS_ERROR";
}
export const GET_SERVER_SIDE_PROPS_ERROR: GET_SERVER_SIDE_PROPS_ERROR = {
  type: "GET_SERVER_SIDE_PROPS_ERROR",
};
