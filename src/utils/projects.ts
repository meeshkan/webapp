import * as t from "io-ts";
import { GraphQLClient } from "graphql-request";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import auth0 from "../utils/auth0";
import { confirmOrCreateUser } from "../utils/user";
import { hookNeedingFetch } from "./hookNeedingFetch";

export enum NegativeProjectsFetchOutcome {
  NOT_LOGGED_IN,
  INVALID_TOKEN_ERROR,
  UNDEFINED_ERROR,
  QUERY_ERROR, // the query we made does not conform to the type we expect
}

export const Team = t.type({
  image: t.union([
    t.null,
    t.type({
      downloadUrl: t.string,
    }),
  ]),
  name: t.string,
  project: t.type({
    items: t.array(
      t.type({
        name: t.string,
        repository: t.type({
            nodeId: t.string
        })
      })
    ),
  }),
});

export type ITeam = t.TypeOf<typeof Team>;

export const getProjects = async (
  session: ISession
): Promise<
  Either<NegativeProjectsFetchOutcome, { session: ISession; teams: ITeam[] }>
> => {
  const _8baseGraphQLClient = new GraphQLClient(
    process.env.EIGHT_BASE_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${session.idToken}`,
      },
    }
  );

  const query = `query {
      user {
        team {
          items{
            name
            image {
              downloadUrl
            }
            project {
              items {
                name
                repository {
                    nodeId
                }
              }
            }
          }
        }
      }
    }`;

  try {
    const result = await _8baseGraphQLClient.request(query);
    const teams = result.user.team ? result.user.team.items : [];

    return t.array(Team).is(teams)
      ? right({ session, teams })
      : (() => {console.error(`Could not perform a typesafe cast of ${teams}`); return left(NegativeProjectsFetchOutcome.QUERY_ERROR)})();
  } catch (e) {
    if (
      e.response && e.response.errors && e.response.errors.filter((error) => error.code === "InvalidTokenError")
        .length > 0
    ) {
      console.error("Invalid token", e);
      return left(NegativeProjectsFetchOutcome.INVALID_TOKEN_ERROR);
    }
    console.error("Error from 8base", e.response.errors);
    return left(NegativeProjectsFetchOutcome.UNDEFINED_ERROR);
  }
};

export type IProjectsProps = Either<
  NegativeProjectsFetchOutcome,
  { session: ISession; teams: ITeam[] }
>;


export interface IProject {
  teamName: string;
  teamImage: string;
  projectName: string;
}

export const teamsToProjects = (teams: ITeam[]): IProject[] =>
  teams.flatMap(({ name, image, project: { items } }) =>
    items.map((item) => ({
      teamName: name,
      teamImage: image ? image.downloadUrl : "https://picsum.photos/200",
      projectName: item.name,
    }))
  );

export const useProjects = (session: ISession) =>
  hookNeedingFetch(async () => {
    const res = await getProjects(session);
    return res;
  });
