import {  Either, isLeft } from "fp-ts/lib/Either";

export const eitherAsPromise = <E, A>(v: Either<E, A>): Promise<A> =>
  new Promise((resolve, reject) =>
    isLeft(v) ? reject(v.left) : resolve(v.right)
  );
