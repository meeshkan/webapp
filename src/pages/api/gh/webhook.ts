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
import { constNull, constVoid } from "fp-ts/lib/function";
import fetch from "isomorphic-unfetch";

type NegativeWebhookOutcome =
  | METHOD_NOT_POST
  | INVALID_SECRET_FROM_GITHUB
  | REST_ENDPOINT_ERROR
  | UNDEFINED_ERROR;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default safeApi(
  (req, res) =>
    pipe(
      req.method === "POST"
        ? TE.right(constVoid())
        : TE.left({ type: "METHOD_NOT_POST" }),
      TE.chain<NegativeWebhookOutcome, void, string>((_) => () =>
        new Promise((resolve, _) => {
          let data = "";
          req.on("data", (chunk) => {
            data += typeof chunk === "string" ? chunk : chunk.toString();
          });
          req.on("end", () => resolve(E.right(data)));
        })
      ),
      TE.chain<NegativeWebhookOutcome, string, string>((body) =>
        "sha1=" +
          crypto
            .createHmac("sha1", process.env.GH_WEBHOOK_SECRET)
            .update(body)
            .digest("hex") ===
        req.headers["x-hub-signature"]
          ? TE.right(body)
          : TE.left({
              type: "INVALID_SECRET_FROM_GITHUB",
              msg:
                "Could not decode secret from github with signature " +
                req.headers["x-hub-signature"],
            })
      ),
      TE.chain((body) =>
        TE.tryCatch(
          () =>
            fetch(process.env.SLACK_GH_WEBHOOK, {
              method: "post",
              body: JSON.stringify({
                text: JSON.stringify(JSON.parse(body), null, 2),
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
