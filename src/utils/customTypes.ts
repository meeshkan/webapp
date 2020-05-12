import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";

// represents a Date from an ISO string
export const DateFromString = new t.Type<Date, string, unknown>(
    'DateFromString',
    (u): u is Date => u instanceof Date,
    (u, c) =>
      either.chain(t.string.validate(u, c), (s) => {
        const d = new Date(s)
        return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d)
      }),
    (a) => a.toISOString()
)

export type IDateFromString = t.TypeOf<typeof DateFromString>;