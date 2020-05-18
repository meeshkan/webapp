import { Either, mapLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { bracket, fromEither, right, TaskEither } from "fp-ts/lib/TaskEither";
import { NextApiRequest, NextApiResponse } from "next";
import logger from "pino";

const Logger = logger();

export const _400ErrorHandler = <E extends object>(
  _req: NextApiRequest,
  _res: NextApiResponse
) => (e: E) => {
  Logger.error("Returning 400");
  Logger.error(e);
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
