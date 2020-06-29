import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

// uses httptypes

const exchangeType = t.type({
  meta: t.type({
    path: t.string,
    path_params: t.object,
  }),
  response: t.type({
    statusCode: t.Integer,
    body: t.union([t.string, t.undefined]),
  }),
  request: t.type({
    body: t.union([t.string, t.undefined]),
    method: t.string,
    // headers: t.record(t.string, t.union([t.array(t.string), t.string])),
  }),
});

export type ExchangeType = t.TypeOf<typeof exchangeType>;

const v1 = t.type({
  commands: t.array(
    t.type({
      success: t.boolean,
      error_message: t.string,
      comment: t.union([t.string, t.undefined]),
      priority: t.union([t.Integer, t.undefined]),
      exchange: t.array(exchangeType),
    })
  ),
});

// for now, our UI expects the format of v0
// this may change
type Noramlized = t.TypeOf<typeof v1>;

// fails silently
const handle_0_0_1 = (i: any): Noramlized =>
  pipe(
    v1.decode(i),
    E.mapLeft((e) => console.log(PathReporter.report(E.left(e)))),
    E.getOrElse(() => ({ commands: [] }))
  );

export const versionTriage = (i: any): Noramlized => handle_0_0_1(i);
