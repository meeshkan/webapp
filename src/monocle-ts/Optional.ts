import { Optional } from "monocle-ts";
import * as O from "fp-ts/lib/Option";

export const optionalHead = <A>() => new Optional<A[], A>(
    s => (s.length > 0 ? O.some(s[0]) : O.none),
    a => s => (s.length > 0 ? [a].concat(s.slice(1)) : s)
  )