import * as A from "fp-ts/lib/Array";
import { constant, constVoid } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import * as _RTE from "../../../fp-ts/ReaderTaskEither";
import * as _TE from "../../../fp-ts/TaskEither";
import auth0 from "../../../utils/auth0";
import { authenticateAppWithGithub, NegativeGithubFetchOutcome } from "../../../utils/gh";
import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import { confirmOrCreateUser, INCORRECT_TYPE_SAFETY } from "../../../utils/user";

interface UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
  error: Error;
}

interface NOT_LOGGED_IN {
  type: "NOT_LOGGED_IN";
}

interface ID_NOT_IN_STATE {
  type: "ID_NOT_IN_STATE";
}

interface PARSING_ERROR {
  type: "PARSING_ERROR";
  errors: t.Errors;
}

type NegativeGHOAuthOutcome =
  | ID_NOT_IN_STATE
  | INCORRECT_TYPE_SAFETY
  | UNDEFINED_ERROR
  | NOT_LOGGED_IN
  | PARSING_ERROR
  | NegativeGithubFetchOutcome;

const PARSING_ERROR = (errors: t.Errors): NegativeGHOAuthOutcome => ({
  type: "PARSING_ERROR",
  errors,
});
const UNDEFINED_ERROR = (error: Error): NegativeGHOAuthOutcome => ({
  type: "UNDEFINED_ERROR",
  error,
});

const NOT_LOGGED_IN = (): NegativeGHOAuthOutcome => ({
  type: "NOT_LOGGED_IN",
});

const ID_NOT_IN_STATE = (): NegativeGHOAuthOutcome => ({
  type: "ID_NOT_IN_STATE",
});

const userType = t.type({ id: t.string });

export const fromQueryParam = (p: string | string[]) =>
  t.string.is(p) ? p : pipe(A.head(p), O.getOrElse(constant("")));

export default safeApi(
  (req, res) =>
    pipe(
      TE.tryCatch(() => auth0().getSession(req), UNDEFINED_ERROR),
      TE.chain(_TE.fromNullable(NOT_LOGGED_IN())),
      TE.chain((session) =>
        pipe(
          t.type({ id: t.string }).decode(JSON.parse(fromQueryParam(req.query.state))),
          TE.fromEither,
          TE.mapLeft(PARSING_ERROR),
          TE.chain(({ id }) =>
            session.user.sub !== id
              ? TE.left(ID_NOT_IN_STATE())
              : TE.right(session)
          )
        )
      ),
      TE.chain(
        pipe(
          _RTE.tryToEitherCatch(
            confirmOrCreateUser("id", userType),
            UNDEFINED_ERROR
          ),
          RTE.chain(({ id }) =>
            _RTE.tryToEitherCatch(
              authenticateAppWithGithub(
                id,
                new URLSearchParams({
                  code: fromQueryParam(req.query.code),
                  client_id: process.env.GH_OAUTH_APP_CLIENT_ID,
                  client_secret: process.env.GH_OAUTH_APP_CLIENT_SECRET,
                  redirect_uri: process.env.GH_OAUTH_REDIRECT_URI,
                  state: fromQueryParam(req.query.state),
                })
              ),
              UNDEFINED_ERROR
            )
          )
        )
      ),
      TE.chain((_) =>
        TE.right(
          res.writeHead(301, {
            Location: "/",
          })
        )
      ),
      TE.chain((_) => TE.right(constVoid()))
    ),
  _400ErrorHandler
);
