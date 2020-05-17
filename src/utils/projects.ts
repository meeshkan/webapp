import * as t from "io-ts";
import { GraphQLClient } from "graphql-request";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { hookNeedingFetch } from "./hookNeedingFetch";
import { fold } from "fp-ts/lib/Either";

interface NOT_LOGGED_IN {
  type: "NOT_LOGGED_IN";
}
interface INVALID_TOKEN_ERROR {
  type: "INVALID_TOKEN_ERROR";
}
interface UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
}
interface QUERY_ERROR {
  type: "QUERY_ERROR";
}

export type NegativeProjectsFetchOutcome =
  | NOT_LOGGED_IN
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | QUERY_ERROR;

export const NOT_LOGGED_IN = (): NegativeProjectsFetchOutcome => ({
  type: "NOT_LOGGED_IN",
});
export const INVALID_TOKEN_ERROR = (): NegativeProjectsFetchOutcome => ({
  type: "INVALID_TOKEN_ERROR",
});
export const UNDEFINED_ERROR = (): NegativeProjectsFetchOutcome => ({
  type: "UNDEFINED_ERROR",
});
export const QUERY_ERROR = (): NegativeProjectsFetchOutcome => ({ type: "QUERY_ERROR" });

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

const queryTp = t.type({
  user: t.type({
    team: t.type({
      items: t.array(Team),
    }),
  }),
});

type QueryTp = t.TypeOf<typeof queryTp>;

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
    return fold(
      () => left(QUERY_ERROR()),
      (query: QueryTp) => right({ session, teams: query.user.team.items})
    )(queryTp.decode(await _8baseGraphQLClient.request(query)))
  } catch (e) {
    if (
      e.response && e.response.errors && e.response.errors.filter((error) => error.code === "InvalidTokenError")
        .length > 0
    ) {
      console.error("Invalid token", e);
      return left(INVALID_TOKEN_ERROR());
    }
    console.error("Error from 8base", e);
    return left(UNDEFINED_ERROR());
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
  hookNeedingFetch(() => getProjects(session));
