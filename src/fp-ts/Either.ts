import {  Either, isLeft, chain } from "fp-ts/lib/Either";
import { identity } from "fp-ts/lib/function";

export const eitherAsPromiseWithReject = <E, A, B>(f: (e: E) => B) => (v: Either<E, A>): Promise<A> =>
  new Promise((resolve, reject) =>
    isLeft(v) ? reject(f(v.left)) : resolve(v.right)
  );

export const eitherAsPromise = <E, A>(v: Either<E, A>): Promise<A> =>
  eitherAsPromiseWithReject<E, A, E>(identity)(v);

export const voidChain = <E, A, B>(v: Either<E, B>): (ma: Either<E, A>) => Either<E, B> =>
 chain(_ => v);
