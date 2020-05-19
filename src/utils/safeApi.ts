import { Either, mapLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { bracket, fromEither, right, TaskEither } from "fp-ts/lib/TaskEither";
import { NextApiRequest, NextApiResponse } from "next";
import logger from "pino";
import { INCORRECT_TYPE_SAFETY } from "./error";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";

const Logger = logger();

const incorrectTypeSafetyHack = (u: unknown): u is INCORRECT_TYPE_SAFETY =>
  t
    .type({
      type: t.literal("INCORRECT_TYPE_SAFETY"),
      msg: t.string,
      // we assume errors exist for now
      // enforce this better by checking errors in the future
    })
    .is(u);

export const _400ErrorHandler = <E extends object>(
  _req: NextApiRequest,
  _res: NextApiResponse
) => (e: E) => {
  Logger.error("Returning 400");
  Logger.error(
    incorrectTypeSafetyHack(e)
      ? {
          type: e.type,
          msg: e.msg,
          errors: PathReporter.report(E.left(e.errors)),
        }
      : e
  );
  _res.status(400);
};

export default <E>(
  f: (_req: NextApiRequest, _res: NextApiResponse) => TaskEither<E, void>,
  fe: (_req: NextApiRequest, _res: NextApiResponse) => (e: E) => void
) => (request: NextApiRequest, response: NextApiResponse): Promise<void> =>
  bracket(
    right(response),
    (res) => f(request, res),
    (res: NextApiResponse, e: Either<E, void>) =>
      pipe(
        e,
        mapLeft(fe(request, res)),
        () => res.end(),
        () => fromEither(e)
      )
  )().then();
