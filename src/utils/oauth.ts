import * as t from "io-ts";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import crypto from "crypto";
import { constant, constVoid } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { NextApiRequest, NextApiResponse } from "next";
import { encrypt, decrypt } from "./sec";
import { ID_NOT_IN_STATE, INCORRECT_TYPE_SAFETY } from "./error";

export const fromQueryParam = (p: string | string[]) =>
  t.string.is(p) ? p : pipe(A.head(p), O.getOrElse(constant("")));

export const decryptOAuthState = (key: string) => (s: string) =>
  decrypt(
    {
      iv: s.slice(0, 32),
      encryptedData: s.slice(32),
    },
    key
  );

export const getGHOAuthState = <E>(session: ISession): E.Either<E, string> =>
  pipe(
    encrypt(
      JSON.stringify({
        id: session.user.sub,
        env: process.env.GITHUB_AUTH_ENV,
      }),
      crypto.randomBytes(16),
      process.env.GH_OAUTH_FLOW_SIGNING_KEY
    ),
    ({ iv, encryptedData }) => E.right(iv + encryptedData)
  );

export const getSlackOAuthState = <E>(
  teamName: string,
  projectName: string
) => (session: ISession): E.Either<E, string> =>
  pipe(
    encrypt(
      JSON.stringify({
        id: session.user.sub,
        teamName,
        projectName,
      }),
      crypto.randomBytes(16),
      process.env.SLACK_OAUTH_FLOW_SIGNING_KEY
    ),
    ({ iv, encryptedData }) => E.right(iv + encryptedData)
  );

export const Oauth = <A extends { id: string }>(
  req: NextApiRequest,
  decryptKey: string,
  tp: t.Type<A, A, unknown>
): RTE.ReaderTaskEither<ISession, ID_NOT_IN_STATE | INCORRECT_TYPE_SAFETY, A> =>
  pipe(
    req.query.state,
    fromQueryParam,
    decryptOAuthState(decryptKey),
    JSON.parse,
    tp.decode,
    RTE.fromEither,
    RTE.mapLeft<t.Errors, INCORRECT_TYPE_SAFETY>((errors) => ({
      type: "INCORRECT_TYPE_SAFETY",
      msg: "Could not parse state from query: " + req.query.state,
      errors,
    })),
    RTE.chain<ISession, ID_NOT_IN_STATE | INCORRECT_TYPE_SAFETY, A, A>(
      (v: A) => (session) =>
        session.user.sub !== v.id
          ? TE.left({
              type: "ID_NOT_IN_STATE",
              msg: "Cannot find ID in the state",
            })
          : TE.right(v)
    )
  );

export const Redirect = <E, B>(res: NextApiResponse) =>
  pipe(
    RTE.right<E, B, NextApiResponse<any>>(
      res.writeHead(301, {
        Location: "/",
      })
    ),
    RTE.chain((_) => RTE.right(constVoid()))
  );
