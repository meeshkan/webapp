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
import {
  authenticateAppWithGithub,
  NegativeGithubFetchOutcome,
} from "../../../utils/gh";
import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import { confirmOrCreateUser } from "../../../utils/user";
import {
  INCORRECT_TYPE_SAFETY,
  ID_NOT_IN_STATE,
  UNDEFINED_ERROR,
  NOT_LOGGED_IN,
} from "../../../utils/error";
import { retrieveSession } from "../session";

type NegativeGHOAuthOutcome =
  | ID_NOT_IN_STATE
  | INCORRECT_TYPE_SAFETY
  | UNDEFINED_ERROR
  | NOT_LOGGED_IN
  | NegativeGithubFetchOutcome;

const userType = t.type({ id: t.string });

export const fromQueryParam = (p: string | string[]) =>
  t.string.is(p) ? p : pipe(A.head(p), O.getOrElse(constant("")));

export default safeApi<NegativeGHOAuthOutcome, void>(
  (req, res) =>
    pipe(
      retrieveSession(req, "oauth.ts default export"),
      TE.chain((session) =>
        pipe(
          t
            .type({ id: t.string })
            .decode(JSON.parse(fromQueryParam(req.query.state))),
          TE.fromEither,
          TE.mapLeft((errors) => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not parse state from query: " + req.query.state,
            errors,
          })),
          TE.chain(({ id }) =>
            session.user.sub !== id
              ? TE.left({ type: "ID_NOT_IN_STATE", msg: "Cannot find ID in the state" })
              : TE.right(session)
          )
        )
      ),
      TE.chain(
        pipe(
          _RTE.tryToEitherCatch(
            confirmOrCreateUser("id", userType),
            (error): NegativeGHOAuthOutcome => ({
              type: "UNDEFINED_ERROR",
              msg: "Unanticipated confirm or create user error in github oauth",
              error,
            })
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
              (error): NegativeGHOAuthOutcome => ({
                type: "UNDEFINED_ERROR",
                msg:
                  "Unanticipated authenticateAppWithGithub error in oauth.ts",
                error,
              })
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
