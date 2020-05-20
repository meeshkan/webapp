import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import * as _TE from "../../../fp-ts/TaskEither";
import { NOT_LOGGED_IN } from "../../../utils/error";
import { getAllGhRepos, NegativeGithubFetchOutcome } from "../../../utils/gh";
import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import { retrieveSession } from "../session";

type NegativeGithubReposOutcome = NegativeGithubFetchOutcome | NOT_LOGGED_IN;

export default safeApi<NegativeGithubReposOutcome>(
  (req, res) =>
    pipe(
      retrieveSession(req, "repos.ts default export"),
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
