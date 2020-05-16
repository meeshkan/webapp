import { right as _right } from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import { chain as chainTE, chainEitherK, tryCatch } from "fp-ts/lib/TaskEither";
import { NextApiRequest, NextApiResponse } from "next";
import { fromNullable } from "../../fp-ts/TaskEither";
import auth0 from "../../utils/auth0";
import safeApi from "../../utils/safeApi";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";

interface UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
  error: Error;
}

interface NOT_LOGGED_IN {
  type: "NOT_LOGGED_IN";
}

type NegativeSessionFetchOutcome = UNDEFINED_ERROR | NOT_LOGGED_IN;

const UNDEFINED_ERROR = (error: Error): NegativeSessionFetchOutcome => ({
  type: "UNDEFINED_ERROR",
  error,
});

const NOT_LOGGED_IN = (): NegativeSessionFetchOutcome => ({
  type: "NOT_LOGGED_IN",
});

export default safeApi(
  (req: NextApiRequest, res: NextApiResponse) =>
    pipe(
      tryCatch(() => auth0().getSession(req), UNDEFINED_ERROR),
      chainTE(fromNullable(NOT_LOGGED_IN())),
      chainEitherK(b => _right(res.json(b)))
    ),
  (_, res) => (e) => res.status(e.type === "NOT_LOGGED_IN" ? 401 : 403) 
);
