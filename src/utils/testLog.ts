import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

// uses httptypes

const v1 = t.type({
  commands: t.array(
    t.type({
      success: t.boolean,
      exchange: t.array(
        t.type({
          meta: t.type({
            path: t.string,
          }),
          request: t.type({
            method: t.string,
            headers: t.record(t.string, t.union([t.array(t.string), t.string])),
            query: t.record(t.string, t.union([t.array(t.string), t.string])),
          }),
        })
      ),
    })
  ),
});

const v0 = t.type({
  commands: t.array(
    t.intersection([
      t.type({
        success: t.boolean,
        path: t.string,
        method: t.string,
      }),
      t.partial({ headers: t.string, query: t.string }),
    ])
  ),
});
type V0 = t.TypeOf<typeof v0>;
// for now, our UI expects the format of v0
// this may change
type Noramlized = t.TypeOf<typeof v0>;

// fails silently
const handle_0_0_0 = (i: any): Noramlized =>
  pipe(
    v0.decode(i),
    E.mapLeft((e) => console.log(PathReporter.report(E.left(e)))),
    E.getOrElse(() => ({ commands: [] }))
  );

// fails silently
const handle_0_0_1 = (i: any): Noramlized =>
  pipe(
    v1.decode(i),
    E.chain((i) =>
      E.right({
        commands: i.commands
          .filter((c) => c.exchange.length > 0)
          .map((command) => ({
            success: command.success,
            path: command.exchange[0].meta.path,
            method: command.exchange[0].request.method.toUpperCase(),
            headers: JSON.stringify(
              command.exchange[0].request.headers,
              null,
              2
            ),
            query: JSON.stringify(command.exchange[0].request.query, null, 2),
          })),
      })
    ),
    E.mapLeft((e) => console.log(PathReporter.report(E.left(e)))),
    E.getOrElse(() => ({ commands: [] }))
  );

export const versionTriage = (i: any): any =>
  i.version === "0.0.0"
    ? handle_0_0_0(i)
    : i.version === "0.0.1"
    ? handle_0_0_1(i)
    : i;
