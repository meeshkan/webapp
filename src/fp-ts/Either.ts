import * as E from "fp-ts/lib/Either";
import { identity, constNull, flow } from "fp-ts/lib/function";
import { NextApiResponse } from "next";
import logger from "pino";
import { pipe } from "fp-ts/lib/pipeable";
import { logchain } from "../utils/safeApi";
import { GET_SERVER_SIDE_PROPS_ERROR } from "../utils/error";

export const eitherAsPromiseWithReject = <E, A, B>(f: (e: E) => B) => (
  v: E.Either<E, A>
): Promise<A> =>
  new Promise((resolve, reject) =>
    E.isLeft(v) ? reject(f(v.left)) : resolve(v.right)
  );

export const eitherAsPromiseWithRedirect = <E, A>(res: NextApiResponse) => (
  defaultTo: A
) => (v: E.Either<E, A>): Promise<A> =>
  new Promise<A>((resolve, _) =>
    E.isLeft(v)
      ? resolve(
          pipe(
            res.writeHead(301, { Location: "/" }),
            (_) => res.end(),
            (_) => defaultTo
          )
        )
      : resolve(v.right)
  );

export const eitherSanitizedWithGenericError = <E extends object, A>(
  v: E.Either<E, A>
) =>
  pipe(
    v,
    E.mapLeft(flow(logchain, () => GET_SERVER_SIDE_PROPS_ERROR)),
    (props) => ({ props })
  );

export const eitherAsPromiseWithSwallowedError = <E, A>(defaultTo: A) => (
  v: E.Either<E, A>
): Promise<A> =>
  new Promise<A>((resolve, _) =>
    E.isLeft(v)
      ? pipe(
          process.env.PRINT_CLIENT_SIDE_ERROR_MESSAGES === "yes"
            ? console.error(v.left)
            : constNull(),
          () => resolve(defaultTo)
        )
      : resolve(v.right)
  );

export const eitherAsPromise = <E, A>(v: E.Either<E, A>): Promise<A> =>
  eitherAsPromiseWithReject<E, A, E>(identity)(v);

export const voidChain = <E, A, B>(
  v: E.Either<E, B>
): ((ma: E.Either<E, A>) => E.Either<E, B>) => E.chain((_) => v);
