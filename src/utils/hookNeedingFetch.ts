import React from "react";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";

export type Loading = InitialLoading | ReLoading;
export type InitialLoading = "InitialLoading";
export type ReLoading = "ReLoading";
export const InitialLoading: Loading = "InitialLoading";
export const ReLoading: ReLoading = "ReLoading";

// returns Either<Loading, value>, and thunk that will refetch the value, and a hydration function
export const hookNeedingFetch = <T>(
  fetchFunction: () => Promise<T>
): [
  Either<Loading, T>,
  () => void,
  React.Dispatch<React.SetStateAction<Either<Loading, T>>>
] => {
  // we need the cast because of a bug in React's type framework
  const [_, __] = React.useState(left(InitialLoading) as Either<Loading, T>);

  const thunk = () => {
    __(left(ReLoading));
    // anonymous function because the function passed to
    // `useEffect` cannot return a promise
    (async () => {
      __(right(await fetchFunction()));
    })();
  };
  
  ///....aaaaaadnnnnnnnnnnnnnnnnnnnndddddd
  React.useEffect(thunk, [0]);

  return [_, thunk, __ ];
};
