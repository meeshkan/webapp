import React from "react";
import fetch from "isomorphic-unfetch";

export const fetchUser = async () => {
  const res = await fetch("/api/me");
  const user = res.ok ? await res.json() : null;
  return user;
};

export const useFetchUser = () => {
  const [user, setUser] = React.useState({
    user: null,
    loadingUser: true,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const user = await fetchUser();
      setUser({ user, loadingUser: false });
    };
    fetchData();
  }, []);

  return user;
};
