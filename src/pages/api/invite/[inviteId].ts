import auth0 from "../../../utils/auth0";
import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import { UNDEFINED_ERROR } from "../../../utils/error";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { constVoid } from "fp-ts/lib/function";
import {
  propagateInviteToDb,
  NegativeInviteOutcome,
} from "../../../utils/invite";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";

export default safeApi<NegativeInviteOutcome, void>(
  (req, res) =>
    pipe(
      TE.tryCatch<NegativeInviteOutcome, ISession>(
        () => auth0().getSession(req),
        (error) => ({
          type: "UNDEFINED_ERROR",
          msg: "get session failed",
          error,
        })
      ),
      TE.chain<NegativeInviteOutcome, ISession, void>((session) =>
        session
          ? pipe(
              propagateInviteToDb(
                typeof req.query.inviteId === "string"
                  ? req.query.inviteId
                  : req.query.inviteId[0]
              )(session),
              TE.chain((_) => TE.right(res.writeHead(301, { Location: "/" }))),
              TE.chain((_) => TE.right(constVoid()))
            )
          : pipe(
              TE.right(
                res.writeHead(301, {
                  Location: `/api/login?inviteId=${req.query.inviteId}`,
                })
              ),
              TE.chain((_) => TE.right(constVoid()))
            )
      )
    ),
  _400ErrorHandler
);
