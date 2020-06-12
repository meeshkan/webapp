import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as E from "fp-ts/lib/Either";

export const seq2 = <R, E, A, B>(
  l: [RTE.ReaderTaskEither<R, E, A>, RTE.ReaderTaskEither<R, E, B>]
): RTE.ReaderTaskEither<R, E[], [A, B]> => (r: R) => () =>
  Promise.all([l[0](r)(), l[1](r)()]).then(([e0, e1]) =>
    E.isLeft(e0) && E.isLeft(e1)
      ? E.left([e0.left, e1.left])
      : E.isLeft(e0)
      ? E.left([e0.left])
      : E.isLeft(e1)
      ? E.left([e1.left])
      : E.right([e0.right, e1.right])
  );

export const seq3 = <R, E, A, B, C>(
  l: [
    RTE.ReaderTaskEither<R, E, A>,
    RTE.ReaderTaskEither<R, E, B>,
    RTE.ReaderTaskEither<R, E, C>
  ]
): RTE.ReaderTaskEither<R, E[], [A, B, C]> => (r: R) => () =>
  Promise.all([seq2([l[0], l[1]])(r)(), l[2](r)()]).then(([e0, e1]) =>
    E.isLeft(e0) && E.isLeft(e1)
      ? E.left([...e0.left, e1.left])
      : E.isLeft(e0)
      ? E.left(e0.left)
      : E.isLeft(e1)
      ? E.left([e1.left])
      : E.right([e0.right[0], e0.right[1], e1.right])
  );
