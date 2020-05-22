import { ReaderTaskEither } from "fp-ts/lib/ReaderTaskEither";
import { TaskEither, chain } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";

export const withX = <EE, R, E, A>(te: TaskEither<EE, R>) => (
  r: ReaderTaskEither<R, E | EE, A>
): TaskEither<E | EE, A> => pipe(te, chain(r));
