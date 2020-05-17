import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import { constVoid } from "fp-ts/lib/function";
import  { fromQueryParam } from "./oauth";

interface UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
  error: Error;
}
interface PARSING_ERROR {
  type: "PARSING_ERROR";
  errors: t.Errors;
}

type NegativeOAuthRoutingOutcome = UNDEFINED_ERROR | PARSING_ERROR;

const UNDEFINED_ERROR = (error): NegativeOAuthRoutingOutcome => ({
  type: "UNDEFINED_ERROR",
  error,
});
const PARSING_ERROR = (errors: t.Errors): NegativeOAuthRoutingOutcome => ({
  type: "PARSING_ERROR",
  errors,
});

export default safeApi(
  ({ query: { state, code } }, res) =>
    pipe(
      t.type({ env: t.string }).decode(JSON.parse(fromQueryParam(state))),
      E.mapLeft(PARSING_ERROR),
      E.chain(({ env }) =>
        pipe(
          res.writeHead(301, {
            Location:
              (env === "dev"
                ? "http://localhost:3000/api/gh/oauth"
                : "https://app.meeshkan.com/api/gh/oauth") +
              "?state=" +
              state +
              "&code=" +
              code,
          }),
          constVoid,
          E.right
        )
      ),
      TE.fromEither
    ),
  _400ErrorHandler
);
