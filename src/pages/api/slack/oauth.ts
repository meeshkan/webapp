import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import crypto from "crypto";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { constant, constVoid, flow } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import fetch from "isomorphic-unfetch";
import { UPDATE_SLACK_INFO_MUTATION } from "../../../gql/pages/api/slack/oauth";
import {
  defaultGQLErrorHandler,
  ID_NOT_IN_STATE,
  INCORRECT_TYPE_SAFETY,
  INVALID_TOKEN_ERROR,
  NOT_LOGGED_IN,
  UNDEFINED_ERROR,
} from "../../../utils/error";
import { eightBaseClient } from "../../../utils/graphql";
import * as Oauth from "../../../utils/oauth";
import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import { encrypt } from "../../../utils/sec";
import { SEPARATOR } from "../../../utils/separator";
import { confirmOrCreateUser } from "../../../utils/user";
import { withSession } from "../session";

const userType = t.type({ id: t.string });

const slackTokenType = t.type({
  access_token: t.string,
  scope: t.string,
  team: t.type({ name: t.string, id: t.string }),
  incoming_webhook: t.type({
    url: t.string,
    channel: t.string,
    configuration_url: t.string,
  }),
  bot_user_id: t.string,
});

type SlackTokenType = t.TypeOf<typeof slackTokenType>;

const authenticateAppWithSlack = (
  userId: string,
  teamName: string,
  projectName: string,
  params: URLSearchParams
) => (session: ISession): TE.TaskEither<NegativeOAuthOutcome, void> =>
  pipe(
    // i: nothing
    // o: response from the slack api
    TE.tryCatch(
      () =>
        fetch(process.env.SLACK_OAUTH_APP_URL, {
          method: "post",
          body: params,
        }),
      (error): NegativeOAuthOutcome => ({
        type: "UNDEFINED_ERROR",
        msg: "Call to slack failed",
        error,
      })
    ),
    // i: response from the slack api
    // o: result of the json transformation
    TE.chain((res) =>
      res.ok
        ? TE.tryCatch(
            () => res.json(),
            (error) => ({
              type: "UNDEFINED_ERROR",
              msg: "Conversion of text response from slack failed",
              error,
            })
          )
        : TE.left({
            type: "REST_ENDPOINT_ERROR",
            msg: `Could not call slack endpoint: ${res.status} ${res.statusText}`,
          })
    ),
    // i: result of the json transformation
    // o: Slack token type decoded
    // pipe(1, (x) => x + 3) === flow((x) => x + 3)(1)
    TE.chainEitherK<NegativeOAuthOutcome, any, SlackTokenType>(
      flow(
        slackTokenType.decode,
        E.mapLeft(
          (errors): NegativeOAuthOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not decode the slack token information",
            errors,
          })
        )
      )
    ),
    // i: Slack token type decoded
    // o: Encrypted slack token
    TE.chain((slackToken) =>
      TE.right(encrypt(JSON.stringify(slackToken), crypto.randomBytes(16)))
    ),
    // i: Encrypted slack token
    // o: Nothing
    TE.chain(({ encryptedData, iv }) =>
      TE.tryCatch(
        () =>
          eightBaseClient(session)
            .request(UPDATE_SLACK_INFO_MUTATION, {
              userId,
              slackSyncCheckSum: encryptedData,
              slackSyncNonce: iv,
              teamName,
              namePlusTeamName: projectName + SEPARATOR + teamName,
            })
            .then(constVoid),
        defaultGQLErrorHandler("insert slack token mutation")
      )
    )
  );

type NegativeOAuthOutcome =
  | ID_NOT_IN_STATE
  | INCORRECT_TYPE_SAFETY
  | UNDEFINED_ERROR
  | INVALID_TOKEN_ERROR
  | NOT_LOGGED_IN;

export const fromQueryParam = (p: string | string[]) =>
  t.string.is(p) ? p : pipe(A.head(p), O.getOrElse(constant("")));

export default safeApi<NegativeOAuthOutcome, void>(
  (req, res) =>
    pipe(
      Oauth.Oauth(
        req,
        t.type({ id: t.string, teamName: t.string, projectName: t.string })
      ),
      RTE.chain(({ teamName, projectName }) =>
        pipe(
          confirmOrCreateUser("id", userType),
          RTE.chain(({ id }) => RTE.right({ id, teamName, projectName }))
        )
      ),
      RTE.chain(({ id, teamName, projectName }) =>
        authenticateAppWithSlack(
          id,
          teamName,
          projectName,
          new URLSearchParams({
            code: fromQueryParam(req.query.code),
            client_id: process.env.SLACK_OAUTH_APP_CLIENT_ID,
            client_secret: process.env.SLACK_OAUTH_APP_CLIENT_SECRET,
            redirect_uri: process.env.SLACK_OAUTH_REDIRECT_URI,
          })
        )
      ),
      RTE.chain((_) => Oauth.Redirect(res)),
      withSession(req, "oauth.ts default export")
    ),
  _400ErrorHandler
);
