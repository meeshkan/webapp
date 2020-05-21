import { Optional } from "monocle-ts";
import * as O from "fp-ts/lib/Option";
import { Lens } from "monocle-ts";
import * as TE from "fp-ts/lib/TaskEither";
import * as M from "fp-ts/lib/Monad";
import { URIS2, Kind2 } from "fp-ts/lib/HKT";

export const optionalHead = <A>() =>
  new Optional<A[], A>(
    (s) => (s.length > 0 ? O.some(s[0]) : O.none),
    (a) => (s) => (s.length > 0 ? [a].concat(s.slice(1)) : s)
  );

export const lensM2Head = <E, A, URI extends URIS2>(
  m: M.Monad2<URI>,
  v: Kind2<URI, E, A>
) =>
  new Lens<Kind2<URI, E, A[]>, Kind2<URI, E, A>>(
    (x) => m.chain(x, (s) => (s.length > 0 ? m.of(s[0]) : v)),
    (x) => (y) =>
      m.chain(y, (s) =>
        s.length > 0 ? m.chain(x, (a) => m.of([a].concat(s.slice(1)))) : m.of(s)
      )
  );

export const lensTaskEitherHead = <E, A>(v: Kind2<"TaskEither", E, A>) =>
  lensM2Head<E, A, "TaskEither">(TE.taskEither, v);

const update = <O, K extends keyof O, A extends O[K]>(o: O, k: K, a: A): O => {
  return a === o[k] ? o : Object.assign({}, o, { [k]: a });
};

export interface LensFromPathM2<E, A, URI extends URIS2> {
  <
    K1 extends keyof A,
    K2 extends keyof A[K1],
    K3 extends keyof A[K1][K2],
    K4 extends keyof A[K1][K2][K3],
    K5 extends keyof A[K1][K2][K3][K4]
  >(
    path: [K1, K2, K3, K4, K5]
  ): Lens<Kind2<URI, E, A>, Kind2<URI, E, A[K1][K2][K3][K4][K5]>>;
  <
    K1 extends keyof A,
    K2 extends keyof A[K1],
    K3 extends keyof A[K1][K2],
    K4 extends keyof A[K1][K2][K3]
  >(
    path: [K1, K2, K3, K4]
  ): Lens<Kind2<URI, E, A>, Kind2<URI, E, A[K1][K2][K3][K4]>>;
  <K1 extends keyof A, K2 extends keyof A[K1], K3 extends keyof A[K1][K2]>(
    path: [K1, K2, K3]
  ): Lens<Kind2<URI, E, A>, Kind2<URI, E, A[K1][K2][K3]>>;
  <K1 extends keyof A, K2 extends keyof A[K1]>(path: [K1, K2]): Lens<
    Kind2<URI, E, A>,
    Kind2<URI, E, A[K1][K2]>
  >;
  <K1 extends keyof A>(path: [K1]): Lens<
    Kind2<URI, E, A>,
    Kind2<URI, E, A[K1]>
  >;
}

export class LensM2<E, B, A, URI extends URIS2> {
  static fromProp<E, A, URI extends URIS2>(
    m: M.Monad2<URI>
  ): <P extends keyof A>(
    prop: P
  ) => Lens<Kind2<URI, E, A>, Kind2<URI, E, A[P]>> {
    return (prop) =>
      new Lens(
        (s) => m.chain(s, (x) => m.of(x[prop])),
        (a) => (s) =>
          m.chain(s, (x) => m.chain(a, (y) => m.of(update(x, prop, y))))
      );
  }
  static fromPath<E, A, URI extends URIS2>(
    m: M.Monad2<URI>
  ): LensFromPathM2<E, A, URI> {
    const _fromProp = LensM2.fromProp<E, A, URI>(m);
    return (path: Array<any>) => {
      const lens = _fromProp(path[0]);
      return path
        .slice(1)
        .reduce((acc, prop) => acc.compose(_fromProp(prop)), lens);
    };
  }
}

export class LensTaskEither<E, B, A> {
  static fromProp<E, A>(): <P extends keyof A>(
    prop: P
  ) => Lens<Kind2<"TaskEither", E, A>, Kind2<"TaskEither", E, A[P]>> {
    return (prop) => LensM2.fromProp<E, A, "TaskEither">(TE.taskEither)(prop);
  }
  static fromPath<E, A>(): LensFromPathM2<E, A, "TaskEither"> {
    return LensM2.fromPath(TE.taskEither);
  }
}
