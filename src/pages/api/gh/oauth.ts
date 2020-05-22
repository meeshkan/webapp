import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as A from "fp-ts/lib/Array";
import { constant, constVoid } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import {
  ID_NOT_IN_STATE,
  INCORRECT_TYPE_SAFETY,
  NOT_LOGGED_IN,
  UNDEFINED_ERROR,
} from "../../../utils/error";
import {
  authenticateAppWithGithub,
  NegativeGithubFetchOutcome,
} from "../../../utils/gh";
import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import { confirmOrCreateUser } from "../../../utils/user";
import { withSession } from "../session";

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
      t
        .type({ id: t.string })
        .decode(JSON.parse(fromQueryParam(req.query.state))),
      (v) => RTE.fromEither<ISession, t.Errors, { id: string }>(v),
      RTE.mapLeft((errors) => ({
        type: "INCORRECT_TYPE_SAFETY",
        msg: "Could not parse state from query: " + req.query.state,
        errors,
      })),
      RTE.chain(({ id }) => (session) =>
        session.user.sub !== id
          ? TE.left({
              type: "ID_NOT_IN_STATE",
              msg: "Cannot find ID in the state",
            })
          : TE.right(session)
      ),
      RTE.chain((_) => confirmOrCreateUser("id", userType)),
      RTE.chain(({ id }) =>
        authenticateAppWithGithub(
          id,
          new URLSearchParams({
            code: fromQueryParam(req.query.code),
            client_id: process.env.GH_OAUTH_APP_CLIENT_ID,
            client_secret: process.env.GH_OAUTH_APP_CLIENT_SECRET,
            redirect_uri: process.env.GH_OAUTH_REDIRECT_URI,
            state: fromQueryParam(req.query.state),
          })
        )
      ),
      RTE.chain((_) =>
        RTE.right(
          res.writeHead(301, {
            Location: "/",
          })
        )
      ),
      RTE.chain((_) => RTE.right(constVoid())),
      withSession(req, "oauth.ts default export")
    ),
  _400ErrorHandler
);
