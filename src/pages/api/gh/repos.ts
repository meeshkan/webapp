import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import { NOT_LOGGED_IN } from "../../../utils/error";
import {
  getAllGhRepos,
  IRepository,
  NegativeGithubFetchOutcome,
} from "../../../utils/gh";
import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import { withSession } from "../session";

type NegativeGithubReposOutcome = NegativeGithubFetchOutcome | NOT_LOGGED_IN;

export default safeApi<NegativeGithubReposOutcome, IRepository[]>(
  (req, res) =>
    pipe(
      getAllGhRepos,
      RTE.chainFirst((b) => RTE.right(res.json(b))),
      withSession(req, "repos.ts default export")
    ),
  _400ErrorHandler
);
