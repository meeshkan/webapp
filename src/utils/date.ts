import * as Ord from "fp-ts/lib/Ord";
import dayjs from "dayjs";

export const newestDateFirst: Ord.Ord<string> = {
  compare: (d0, d1) =>
    dayjs(d0).toDate().getTime() > dayjs(d1).toDate().getTime() ? -1 : 1,
  equals: (d0, d1) =>
    dayjs(d0).toDate().getTime() === dayjs(d1).toDate().getTime(),
};
