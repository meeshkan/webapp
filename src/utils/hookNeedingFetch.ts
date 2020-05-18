import React from "react";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";

export type Loading = "Loading";
export const Loading: Loading  = "Loading";

export const hookNeedingFetch = <T>(fetchFunction: () => Promise<T>): Either<Loading, T> => {
  // we need the cast because of a bug in React's type framework
  const [_, __] = React.useState(left(Loading) as Either<Loading, T>);

  React.useEffect(() => {
    // anonymous function because the function passed to
    // `useEffect` cannot return a promise
    (async () => {console.log("PRE RUNNING FETCH FUNCTION");
      __(right(await fetchFunction()));
    })();
  }, [isLeft(_)]);

  return _;
};
