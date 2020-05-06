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

    const ghGraphQLClient = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        authorization: `Bearer ${process.env.GITHUB_USER_INFO_AUTH_TOKEN}`,
      },
    });
  
    const ghData = await ghGraphQLClient.request(`query {
      user(login: "${ghLogin}") {
              id
          }
      }`);
    userState.node_id = ghData.user.id;

    const gcmsGraphQLClient = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_QUERY_AUTH_TOKEN}`,
      },
    });

    const gcmsData = await gcmsGraphQLClient.request(`query {
      projects(where: {
        user: { githubUserNodeId: "${userState.node_id}" }
      }) {
        githubRepositoryNodeId
        githubOrganizationNodeId
        organizationImage {
          fileName
        }
      }
    }`);

    const projectsQuery = gcmsData.projects.map((project, i) => `q${i}: repository(id: "${project.githubRepositoryNodeId}") {
            owner {
                login
                avatarUrl
            }
            id
            name
        }`);
    const projectsData = await ghGraphQLClient.request(`query {
      ${projectsQuery.join('\n')}
      }`);
    userState.projects = Object.values(projectsData);
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
