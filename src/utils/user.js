import React from "react";
import fetch from "isomorphic-unfetch";
import { GraphQLClient } from 'graphql-request';

// Use a global to save the user, so we don't have to fetch it again after page navigations
let userState;

const User = React.createContext({ user: null, loading: false });

export const fetchUser = async () => {
  if (userState !== undefined) {
    return userState;
  }

  const res = await fetch("/api/me");
  userState = res.ok ? await res.json() : null;
  if (userState !== null) {
    // fetch the user on github
    const ghLogin = userState.nickname;
    const endpoint = 'https://api.github.com/graphql';

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${process.env.GITHUB_USER_INFO_AUTH_TOKEN}`,
      },
    });
  
    const query = `query {
      user(login: "${ghLogin}") {
              id
          }
      }`;

    const data = await graphQLClient.request(query);
    userState.node_id = data.user.id;
  }
  return userState;
};

export const UserProvider = ({ value, children }) => {
  const { user } = value;

  // If the user was fetched in SSR add it to userState so we don't fetch it again
  React.useEffect(() => {
    if (!userState && user) {
      userState = user;
    }
  }, []);

  return <User.Provider value={value}>{children}</User.Provider>;
};

export const useUser = () => React.useContext(User);

export const useFetchUser = () => {
  const [data, setUser] = React.useState({
    user: userState || null,
    loading: userState === undefined,
  });

  React.useEffect(() => {
    if (userState !== undefined) {
      return;
    }

    let isMounted = true;

    fetchUser().then((user) => {
      // Only set the user if the component is still mounted
      if (isMounted) {
        setUser({ user, loading: false });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [userState]);

  return data;
};
