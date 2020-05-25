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
import * as Oauth from "../../../utils/oauth";

type NegativeGHOAuthOutcome =
  | ID_NOT_IN_STATE
  | INCORRECT_TYPE_SAFETY
  | UNDEFINED_ERROR
  | NOT_LOGGED_IN
  | NegativeGithubFetchOutcome;

const userType = t.type({ id: t.string });
type UserType = t.TypeOf<typeof userType>;
const ghStateType = t.type({ id: t.string });
type GHStateType = t.TypeOf<typeof ghStateType>;

export const fromQueryParam = (p: string | string[]) =>
  t.string.is(p) ? p : pipe(A.head(p), O.getOrElse(constant("")));

export default safeApi<NegativeGHOAuthOutcome, void>(
  (req, res) =>
    pipe(
      Oauth.Oauth(req, process.env.GH_OAUTH_FLOW_SIGNING_KEY, ghStateType),
      RTE.chain<ISession, NegativeGHOAuthOutcome, GHStateType, UserType>(() =>
        confirmOrCreateUser("id", userType)
      ),
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
      RTE.chain((_) => Oauth.Redirect(res)),
      withSession(req, "oauth.ts default export")
    ),
  _400ErrorHandler
);
