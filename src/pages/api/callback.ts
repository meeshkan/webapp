import auth0 from "../../utils/auth0";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { propagateInviteToDb } from "../../utils/invite";
import { UNDEFINED_ERROR } from "../../utils/error";
import { pipe } from "fp-ts/lib/pipeable";

type NegativeCallbackOutcome = UNDEFINED_ERROR;

export default async function callback(req, res) {
  try {
    await auth0().handleCallback(req, res, {
      redirectTo: "/api/default-team-hook",
      onUserLoaded: (_, __, session, state) =>
        state.inviteId
          ? pipe(
              propagateInviteToDb(state.inviteId)(session)().then(
                (e) =>
                  new Promise((resolve, reject) =>
                    E.isLeft(e) ? reject(e) : resolve(session)
                  )
              )
            )
          : Promise.resolve(session),
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
