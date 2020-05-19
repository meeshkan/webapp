import { Either, isLeft, chain } from "fp-ts/lib/Either";
import { identity, constNull } from "fp-ts/lib/function";
import { NextApiResponse } from "next";
import { pipe } from "fp-ts/lib/pipeable";

export const eitherAsPromiseWithReject = <E, A, B>(f: (e: E) => B) => (
  v: Either<E, A>
): Promise<A> =>
  new Promise((resolve, reject) =>
    isLeft(v) ? reject(f(v.left)) : resolve(v.right)
  );

export const eitherAsPromiseWithRedirect = <E, A>(res: NextApiResponse) => (
  defaultTo: A
) => (v: Either<E, A>): Promise<A> =>
  new Promise<A>((resolve, _) =>
    isLeft(v)
      ? resolve(
          pipe(
            res.writeHead(301, { Location: "/" }),
            (_) => res.end(),
            (_) => defaultTo
          )
        )
      : resolve(v.right)
  );

export const eitherAsPromiseWithSwallowedError = <E, A>(defaultTo: A) => (
  v: Either<E, A>
): Promise<A> =>
  new Promise<A>((resolve, _) =>
    isLeft(v)
      ? pipe(
          process.env.PRINT_CLIENT_SIDE_ERROR_MESSAGES === "yes"
            ? console.error(v.left)
            : constNull(),
          () => resolve(defaultTo)
        )
      : resolve(v.right)
  );

export const eitherAsPromise = <E, A>(v: Either<E, A>): Promise<A> =>
  eitherAsPromiseWithReject<E, A, E>(identity)(v);

export const voidChain = <E, A, B>(
  v: Either<E, B>
): ((ma: Either<E, A>) => Either<E, B>) => chain((_) => v);
