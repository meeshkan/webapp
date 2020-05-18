import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import { constVoid } from "fp-ts/lib/function";
import { fromQueryParam } from "./oauth";
import { INCORRECT_TYPE_SAFETY } from "../../../utils/error";

const envType = t.type({ env: t.string });

export default safeApi(
  ({ query: { state, code } }, res) =>
    pipe(
      envType.decode(JSON.parse(fromQueryParam(state))),
      E.mapLeft(
        (errors): INCORRECT_TYPE_SAFETY => ({
          type: "INCORRECT_TYPE_SAFETY",
          msg: "Could not parse state from query in oauth-triage: " + state,
          errors,
        })
      ),
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
