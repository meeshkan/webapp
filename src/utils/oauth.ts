import * as t from "io-ts";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { constant, constVoid } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { NextApiRequest, NextApiResponse } from "next";

export const fromQueryParam = (p: string | string[]) =>
  t.string.is(p) ? p : pipe(A.head(p), O.getOrElse(constant("")));

export const Oauth = <A extends { id: string }>(
  req: NextApiRequest,
  tp: t.Type<A, A, unknown>
) =>
  pipe(
    tp.decode(JSON.parse(fromQueryParam(req.query.state))),
    (v) => RTE.fromEither<ISession, t.Errors, A>(v),
    RTE.mapLeft((errors) => ({
      type: "INCORRECT_TYPE_SAFETY",
      msg: "Could not parse state from query: " + req.query.state,
      errors,
    })),
    RTE.chain((v: A) => (session) =>
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
