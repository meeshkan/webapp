import { Either, mapLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { bracket, fromEither, right, TaskEither } from "fp-ts/lib/TaskEither";
import { NextApiRequest, NextApiResponse } from "next";
import logger from "pino";
import { INCORRECT_TYPE_SAFETY } from "./error";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";
import * as I from "fp-ts/lib/Identity";
import { constNull, flow } from "fp-ts/lib/function";

const Logger = logger();

export const incorrectTypeSafetyHack = (
  u: unknown
): u is INCORRECT_TYPE_SAFETY =>
  t
    .type({
      type: t.literal("INCORRECT_TYPE_SAFETY"),
      msg: t.string,
      // we assume errors exist for now
      // enforce this better by checking errors in the future
    })
    .is(u);

export const logchain = <E extends object>(e: E) =>
  pipe(
    incorrectTypeSafetyHack(e)
      ? {
          type: e.type,
          msg: e.msg,
          errors: PathReporter.report(E.left(e.errors)),
        }
      : e,
    I.chainFirst((toLog) => Logger.error(toLog))
  );

export const _400ErrorHandler = (_req: NextApiRequest, _res: NextApiResponse) =>
  flow(logchain, () => _res.status(400));

export default <E, A>(
  f: (_req: NextApiRequest, _res: NextApiResponse) => TaskEither<E, A>,
  fe: (_req: NextApiRequest, _res: NextApiResponse) => (e: E) => void
) => (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<E.Either<E, A>> =>
  bracket(
    right(response),
    (res) => f(request, res),
    (res: NextApiResponse, e: Either<E, A>) =>
      pipe(
        e,
        mapLeft(fe(request, res)),
        () => res.end(),
        () => fromEither(E.right(constNull()))
      )
  )();
