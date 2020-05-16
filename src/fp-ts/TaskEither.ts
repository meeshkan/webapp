import * as t from "io-ts";
import { Lazy } from "fp-ts/lib/function";
import {
  TaskEither,
  tryCatch,
  left as teLeft,
  right as teRight,
} from "fp-ts/lib/TaskEither";
import { left, right, Either, isLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

export function tryToEitherCatch<E, A>(
  f: Lazy<Promise<Either<E, A>>>,
  onRejected: (reason: unknown) => E
): TaskEither<E, A> {
  return () => f().catch((reason) => left(onRejected(reason)));
}

export const fromNully = <E, A>(l: E) => (
  a: A | null | undefined
): TaskEither<E, A> => (a ? teRight(a) : teLeft(l));
