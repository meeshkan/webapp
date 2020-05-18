import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { GraphQLClient } from "graphql-request";
import * as t from "io-ts";
import { Lens } from "monocle-ts";
import { defaultGQLErrorHandler, INCORRECT_TYPE_SAFETY, INVALID_TOKEN_ERROR, NOT_LOGGED_IN, UNDEFINED_ERROR } from "./error";
import { hookNeedingFetch } from "./hookNeedingFetch";

export type NegativeTeamsFetchOutcome =
  | NOT_LOGGED_IN
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | INCORRECT_TYPE_SAFETY;

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
      (error): NegativeTeamsFetchOutcome =>
        defaultGQLErrorHandler("teams query")(error)
    ),
    TE.chainEitherK(
      flow(
        queryTp.decode,
        E.mapLeft(
          (errors): NegativeTeamsFetchOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Teams list from gql endpoint does not match type definition",
            errors,
          })
        )
      )
    ),
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
