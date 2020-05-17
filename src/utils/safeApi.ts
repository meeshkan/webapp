import { chain, Either, right as _right, mapLeft } from "fp-ts/lib/Either";
import { TaskEither, bracket, right, fromEither } from "fp-ts/lib/TaskEither";
import { NextApiRequest, NextApiResponse } from "next";
import { eitherAsPromiseWithReject } from "../fp-ts/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";

export const _400ErrorHandler = <E>(_req: NextApiRequest, _res: NextApiResponse) => (e: E) => {console.error("Returning 400"); console.error(e); _res.status(400);}

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
