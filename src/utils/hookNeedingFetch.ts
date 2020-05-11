import React from "react";

export default (fetchFunction) => {
  const [thingBeingFetched, setThingBeingFetched] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // anonymous function because the function passed to
    // `useEffect` cannot return a promise
    (async () => {
      const asset = await fetchFunction();
      setThingBeingFetched(asset);
      setLoading(false);  
    })();
  }, [loading]);

  return [thingBeingFetched, loading];
};
