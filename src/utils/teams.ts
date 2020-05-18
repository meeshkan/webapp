import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { GraphQLClient } from "graphql-request";
import * as t from "io-ts";
import { Lens } from "monocle-ts";
import { gqlRequestError } from "./graphql";
import { hookNeedingFetch } from "./hookNeedingFetch";
import { INCORRECT_TYPE_SAFETY } from "./user";

interface NOT_LOGGED_IN {
  type: "NOT_LOGGED_IN";
}
interface INVALID_TOKEN_ERROR {
  type: "INVALID_TOKEN_ERROR";
}
interface UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
  error: unknown;
}
interface QUERY_ERROR {
  type: "QUERY_ERROR";
  errors: t.Errors;
}

export type NegativeTeamsFetchOutcome =
  | NOT_LOGGED_IN
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | INCORRECT_TYPE_SAFETY
  | QUERY_ERROR;

export const NOT_LOGGED_IN = (): NegativeTeamsFetchOutcome => ({
  type: "NOT_LOGGED_IN",
});
export const INVALID_TOKEN_ERROR = (): NegativeTeamsFetchOutcome => ({
  type: "INVALID_TOKEN_ERROR",
});
export const UNDEFINED_ERROR = (error: unknown): NegativeTeamsFetchOutcome => ({
  type: "UNDEFINED_ERROR",
  error,
});
export const QUERY_ERROR = (errors: t.Errors): NegativeTeamsFetchOutcome => ({
  type: "QUERY_ERROR",
  errors,
});

export const Team = t.type({
  id: t.string,
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
          nodeId: t.string,
        }),
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

export const getTeams = async (
  session: ISession
): Promise<E.Either<NegativeTeamsFetchOutcome, ITeam[]>> =>
  pipe(
    TE.tryCatch(
      () =>
        new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
          headers: {
            authorization: `Bearer ${session.idToken}`,
          },
        }).request(
          `query {
            user {
              team {
                items{
                  name
                  id
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
          }`
        ),
      (e) =>
        gqlRequestError.is(e) &&
        e.response.errors.filter((error) => error.code === "InvalidTokenError")
          .length > 0
          ? INVALID_TOKEN_ERROR()
          : UNDEFINED_ERROR(e)
    ),
    TE.chainEitherK(flow(queryTp.decode, E.mapLeft(QUERY_ERROR))),
    TE.chainEitherK(
      flow(Lens.fromPath<QueryTp>()(["user", "team", "items"]).get, E.right)
    )
  )();
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

export const useTeams = (session: ISession) =>
  hookNeedingFetch(() => getTeams(session));
