import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { NextApiRequest, NextApiResponse } from "next";
import * as _TE from "../../fp-ts/TaskEither";
import auth0 from "../../utils/auth0";
import safeApi from "../../utils/safeApi";
import { UNDEFINED_ERROR, NOT_LOGGED_IN } from "../../utils/error";

export type NegativeSessionFetchOutcome = UNDEFINED_ERROR | NOT_LOGGED_IN;

export default safeApi(
  (req: NextApiRequest, res: NextApiResponse) =>
    pipe(
      TE.tryCatch(
        () => auth0().getSession(req),
        (error): NegativeSessionFetchOutcome => ({
          type: "UNDEFINED_ERROR",
          msg: "Undefined auth0 error in session.ts",
          error,
        })
      ),
      TE.chain(
        _TE.fromNullable({
          type: "NOT_LOGGED_IN",
          msg: "Session is null in session.ts",
        })
      ),
      TE.chainEitherK((b) => E.right(res.json(b)))
    ),
  (_, res) => (e) => res.status(e.type === "NOT_LOGGED_IN" ? 401 : 403)
);
