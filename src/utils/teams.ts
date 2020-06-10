import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { Lens } from "monocle-ts";
import { GET_TEAMS_QUERY } from "../gql/utils/teams";
import {
  defaultGQLErrorHandler,
  INCORRECT_TYPE_SAFETY,
  INVALID_TOKEN_ERROR,
  NOT_LOGGED_IN,
  UNDEFINED_ERROR,
  UNKNOWN_GRAPHQL_ERROR,
} from "./error";
import { eightBaseClient } from "./graphql";
import { hookNeedingFetch } from "./hookNeedingFetch";

export type NegativeTeamsFetchOutcome =
  | NOT_LOGGED_IN
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | UNKNOWN_GRAPHQL_ERROR
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
  users: t.type({
    items: t.array(
      t.type({
        email: t.string,
        status: t.string,
        avatar: t.union([
          t.null,
          t.type({
            downloadUrl: t.string,
          }),
        ]),
      })
    ),
  }),
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

export const getTeams = (
  session: ISession
): TE.TaskEither<NegativeTeamsFetchOutcome, ITeam[]> =>
  pipe(
    TE.tryCatch(
      () => eightBaseClient(session).request(GET_TEAMS_QUERY),
      defaultGQLErrorHandler("teams query")
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
  );

export interface IProject {
  teamName: string;
  teamImage: string;
  projectName: string;
}

export const teamsToProjects = (teams: ITeam[]): IProject[] =>
  pipe(
    teams.map(({ name, image, project: { items } }) =>
      items.map((item) => ({
        teamName: name,
        teamImage: image ? image.downloadUrl : "https://picsum.photos/200",
        projectName: item.name,
      }))
    ),
    A.flatten
  );

export const useTeams = (session: ISession) =>
  pipe(session, getTeams, hookNeedingFetch);
