import auth0 from "../../../utils/auth0";
import {
  getAllGhRepos,
  UNDEFINED_ERROR,
  NegativeGithubFetchOutcome,
  IRepository,
} from "../../../utils/gh";
import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import * as TE from "fp-ts/lib/TaskEither";
import * as _TE from "../../../fp-ts/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { NOT_LOGGED_IN } from "../session";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";

type NegativeGithubReposOutcome = NegativeGithubFetchOutcome | NOT_LOGGED_IN;

const logFriend = (s: string) => <A>(a: A): A => {
  console.log(s);
  console.log(a);
  return a;
}

export default safeApi<NegativeGithubReposOutcome>(
  (req, res) =>
    pipe(
      TE.tryCatch(() => auth0().getSession(req), UNDEFINED_ERROR),
      logFriend("this is the status"),
      TE.chain<NegativeGithubReposOutcome, ISession, ISession>(
        _TE.fromNullable(NOT_LOGGED_IN())
      ),
      logFriend("this is the status after null check"),
      TE.chain((session) =>
        _TE.tryToEitherCatch(() => getAllGhRepos(session), UNDEFINED_ERROR)
      ),
      TE.chainEitherK((b) => E.right(res.json(b)))
    ),
  _400ErrorHandler
);
