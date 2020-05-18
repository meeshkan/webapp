import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { NextApiRequest, NextApiResponse } from "next";
import * as _TE from "../../fp-ts/TaskEither";
import auth0 from "../../utils/auth0";
import safeApi from "../../utils/safeApi";

interface UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
  error: unknown;
}

export interface NOT_LOGGED_IN {
  type: "NOT_LOGGED_IN";
}

type NegativeSessionFetchOutcome = UNDEFINED_ERROR | NOT_LOGGED_IN;

const UNDEFINED_ERROR = (error: unknown): NegativeSessionFetchOutcome => ({
  type: "UNDEFINED_ERROR",
  error,
});

export const NOT_LOGGED_IN = (): NegativeSessionFetchOutcome => ({
  type: "NOT_LOGGED_IN",
});

const logFriend = (s: string) => <A>(a: A): A => {
  console.log(s);
  console.log(a);
  return a;
}
export default safeApi(
  (req: NextApiRequest, res: NextApiResponse) =>
    pipe(
      TE.tryCatch(() => auth0().getSession(req), UNDEFINED_ERROR),
      logFriend("SESSION NOW"),
      TE.chain(_TE.fromNullable(NOT_LOGGED_IN())),
      logFriend("SESSION AFTER NULL CHECK"),
      TE.chainEitherK(b => E.right(res.json(b)))
    ),
  (_, res) => (e) => res.status(e.type === "NOT_LOGGED_IN" ? 401 : 403) 
);
