import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { NextApiRequest, NextApiResponse } from "next";
import auth0 from "../../utils/auth0";
import safeApi from "../../utils/safeApi";
import { UNDEFINED_ERROR, NOT_LOGGED_IN } from "../../utils/error";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { ReaderTaskEither } from "fp-ts/lib/ReaderTaskEither";
import { withX } from "../../utils/with";

export type NegativeSessionFetchOutcome = UNDEFINED_ERROR | NOT_LOGGED_IN;

export const getTokenFromSessionOrEnv = (session: ISession) =>
  process.env.MEESHKAN_ALTERNATIVE_TOKEN
    ? process.env.MEESHKAN_ALTERNATIVE_TOKEN
    : session.idToken;
export const withSession = <E, A>(req: NextApiRequest, ctx: string) =>
  withX<
    NegativeSessionFetchOutcome,
    ISession,
    E | NegativeSessionFetchOutcome,
    A
  >(retrieveSession(req, ctx));

export const retrieveSession = (
  req: NextApiRequest,
  ctx: string
): TE.TaskEither<NegativeSessionFetchOutcome, ISession> =>
  pipe(
    TE.tryCatch(
      () => auth0().getSession(req),
      (error): UNDEFINED_ERROR | NOT_LOGGED_IN => ({
        type: "UNDEFINED_ERROR",
        msg: "Undefined auth0 error in [teamName].tsx",
        error,
      })
    ),
    TE.chain((session) =>
      session
        ? TE.right(session)
        : TE.left({
            type: "NOT_LOGGED_IN",
            msg: `Session is null in: ${ctx}`,
          })
    )
  );

export default safeApi<NegativeSessionFetchOutcome, ISession>(
  (req: NextApiRequest, res: NextApiResponse) =>
    pipe(
      retrieveSession(req, "session.ts default export"),
      TE.chainFirst((b) => TE.right(res.json(b)))
    ),
  (_, res) => (e) => res.status(e.type === "NOT_LOGGED_IN" ? 401 : 403)
);
