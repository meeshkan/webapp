import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import getRawBody from "next/dist/compiled/raw-body";
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
  (req, res) =>
    pipe(
      req.method === "POST"
        ? TE.right(req.body)
        : TE.left({ type: "METHOD_NOT_POST" }),
      TE.chain<NegativeWebhookOutcome, any, Response>((body) =>
        TE.tryCatch(
          () =>
            fetch(process.env.SLACK_GH_WEBHOOK, {
              method: "post",
              body: JSON.stringify({
                text: "```\n" + JSON.stringify(body, null, 2) + "\n```",
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }),
          (error): NegativeWebhookOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Call to slack webhook for github app failed",
            error,
          })
        )
      ),
      TE.chain((res) =>
        res.ok
          ? TE.right(constNull())
          : TE.left<NegativeWebhookOutcome, void>({
              type: "REST_ENDPOINT_ERROR",
              msg: "Call to slack webhook failed",
            })
      ),
      TE.chain((_) => TE.right(res.status(200)))
    ),
  _400ErrorHandler
);
