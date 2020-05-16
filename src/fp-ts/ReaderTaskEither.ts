import { tryCatch as _tryCatch } from "fp-ts/lib/TaskEither";
import { tryToEitherCatch as _tryToEitherCatch } from "./TaskEither";
import { ReaderTaskEither, chain } from "fp-ts/lib/ReaderTaskEither";
import { Either, isLeft } from "fp-ts/lib/Either";


export function tryCatch<R, E, A>(
  f: (r: R) => Promise<A>,
  onRejected: (reason: unknown) => E
): ReaderTaskEither<R, E, A> {
  return (r: R) => _tryCatch(() => f(r), onRejected);
}

export function tryToEitherCatch<R, E, A>(
  f: (r: R) => Promise<Either<E, A>>,
  onRejected: (reason: unknown) => E
): ReaderTaskEither<R, E, A> {
  return (r: R) => _tryToEitherCatch(() => f(r), onRejected);
}

export const chainWithAsk = <R, E, A, B>(
  f: (a: A) => (r: R) => ReaderTaskEither<R, E, B>
) => (ma: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, B> => (
  r: R
) => () => ma(r)().then((v) => (isLeft(v) ? v : f(v.right)(r)(r)()));

export const voidChain = <R, E, A, B>(
  v: ReaderTaskEither<R, E, B>
): (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B> => chain(() => v)

export const chainEitherKWithAsk = <R, E, A, B>(
  f: (a: A) => (r: R) => Either<E, B>
) => (ma: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, B> => (
  r: R
) => () => ma(r)().then((v) => (isLeft(v) ? v : f(v.right)(r)));
