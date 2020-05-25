import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import {
  METHOD_NOT_POST,
  UNDEFINED_ERROR,
  INVALID_SECRET_FROM_GITHUB,
  REST_ENDPOINT_ERROR,
} from "../../../utils/error";
import safeApi, { _400ErrorHandler } from "../../../utils/safeApi";
import crypto from "crypto";
import { constNull } from "fp-ts/lib/function";
import fetch from "isomorphic-unfetch";

type NegativeWebhookOutcome =
  | METHOD_NOT_POST
  | INVALID_SECRET_FROM_GITHUB
  | REST_ENDPOINT_ERROR
  | UNDEFINED_ERROR;

export default safeApi(
  ({ body, method, headers }) =>
    pipe(
      method === "POST" ? E.right(body) : E.left({ type: "METHOD_NOT_POST" }),
      E.chain<NegativeWebhookOutcome, string, void>((body) =>
        "sha1=" +
          crypto
            .createHmac("sha1", process.env.GH_WEBHOOK_SECRET)
            .update(body)
            .digest("hex") ===
        headers["X-Hub-Signature"]
          ? E.left({ type: "INVALID_SECRET_FROM_GITHUB" })
          : E.right(constNull())
      ),
      TE.fromEither,
      TE.chain((_) =>
        TE.tryCatch(
          () =>
            fetch(process.env.SLACK_GH_WEBHOOK, {
              method: "post",
              body: body,
            }),
          (error): NegativeWebhookOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Call to slack webhook failed",
            error,
          })
        )
      ),
      TE.chain((res) =>
        res.ok
          ? TE.right(constNull())
          : TE.left({
              type: "REST_ENDPOINT_ERROR",
              msg: "Call to slack webhook failed",
            })
      )
    ),
  _400ErrorHandler
);
