import auth0 from "../../../utils/auth0";
import {
  getAllGhRepos,
  NegativeGithubFetchOutcome,
  IRepository,
} from "../../../utils/gh";
import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import * as TE from "fp-ts/lib/TaskEither";
import * as _TE from "../../../fp-ts/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { NOT_LOGGED_IN } from "../../../utils/error";

type NegativeGithubReposOutcome = NegativeGithubFetchOutcome | NOT_LOGGED_IN;

export default safeApi<NegativeGithubReposOutcome>(
  (req, res) =>
    pipe(
      TE.tryCatch(
        () => auth0().getSession(req),
        (error): NegativeGithubReposOutcome => ({
          type: "UNDEFINED_ERROR",
          msg: "Undefined auth0 error in repos.ts",
          error,
        })
      ),
      TE.chain(
        _TE.fromNullable({
          type: "NOT_LOGGED_IN",
          msg: "Session is null in repos.ts",
        })
      ),
      TE.chain((session) =>
        _TE.tryToEitherCatch(
          () => getAllGhRepos(session),
          (error): NegativeGithubReposOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Undefined auth0 error in getAllGhRepos",
            error,
          })
        )
      ),
      TE.chainEitherK((b) => E.right(res.json(b)))
    ),
  _400ErrorHandler
);
