import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as TE from "fp-ts/lib/TaskEither";
import { UNDEFINED_ERROR } from "./error";
import { constVoid } from "fp-ts/lib/function";
import fetch from "isomorphic-unfetch";
import { pipe } from "fp-ts/lib/pipeable";
import {
  confirmOrCreateUser,
  NegativeConfirmOrCreateUserOutcome,
} from "./user";
import * as t from "io-ts";

export type NegativeInviteOutcome =
  | UNDEFINED_ERROR
  | NegativeConfirmOrCreateUserOutcome;

export const propagateInviteToDb = (inviteId: string) => (
  session: ISession
): TE.TaskEither<NegativeInviteOutcome, void> =>
  pipe(
    confirmOrCreateUser("id", t.type({ id: t.string }))(session),
    TE.chain(({ id }) =>
      TE.tryCatch<NegativeInviteOutcome, Response>(
        () =>
          fetch(process.env.TEAM_INVITE_WEBHOOK, {
            method: "post",
            headers: {
              "x-meeshkan-user-id": id,
              "x-meeshkan-invite-id": inviteId,
            },
          }),
        (error) => ({
          type: "UNDEFINED_ERROR",
          msg: "fetch did not execute when propagating invite",
          error,
        })
      )
    ),
    TE.chain<NegativeInviteOutcome, Response, void>((res) =>
      res.ok
        ? TE.right(constVoid())
        : TE.left({
            type: "UNDEFINED_ERROR",
            msg: "fetch did not execute when propagating invite",
            error: res,
          })
    )
  );
