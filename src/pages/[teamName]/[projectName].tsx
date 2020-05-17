import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { Grid } from "@chakra-ui/core";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import { GraphQLClient } from "graphql-request";
import * as t from "io-ts";
import { Lens } from "monocle-ts";
import React from "react";
import Branch from "../../components/Dashboard/branch";
import Chart from "../../components/Dashboard/chart";
import Production from "../../components/Dashboard/production";
// import { DateFromString, IDateFromString } from "../../utils/customTypes";
import Settings from "../../components/Dashboard/settings";
import * as _E from "../../fp-ts/Either";
import * as _RTE from "../../fp-ts/ReaderTaskEither";
import * as _TE from "../../fp-ts/TaskEither";
// cards
import auth0 from "../../utils/auth0";
import { gqlRequestError } from "../../utils/graphql";
import { confirmOrCreateUser, INCORRECT_TYPE_SAFETY } from "../../utils/user";

interface NOT_LOGGED_IN {
  type: "NOT_LOGGED_IN";
}
interface PROJECT_DOES_NOT_EXIST {
  type: "PROJECT_DOES_NOT_EXIST";
}
interface TEAM_DOES_NOT_EXIST {
  type: "TEAM_DOES_NOT_EXIST";
}
interface INVALID_TOKEN_ERROR {
  type: "INVALID_TOKEN_ERROR";
}
interface UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
  error: Error;
}
interface QUERY_ERROR {
  type: "QUERY_ERROR";
}

type NegativeProjectFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | PROJECT_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | QUERY_ERROR
  | INCORRECT_TYPE_SAFETY;

const NOT_LOGGED_IN = (): NegativeProjectFetchOutcome => ({
  type: "NOT_LOGGED_IN",
});
const PROJECT_DOES_NOT_EXIST = (): NegativeProjectFetchOutcome => ({
  type: "PROJECT_DOES_NOT_EXIST",
});
const TEAM_DOES_NOT_EXIST = (): NegativeProjectFetchOutcome => ({
  type: "TEAM_DOES_NOT_EXIST",
});
const INVALID_TOKEN_ERROR = (): NegativeProjectFetchOutcome => ({
  type: "INVALID_TOKEN_ERROR",
});
const UNDEFINED_ERROR = (error): NegativeProjectFetchOutcome => ({
  type: "UNDEFINED_ERROR",
  error,
});
const QUERY_ERROR = (): NegativeProjectFetchOutcome => ({
  type: "QUERY_ERROR",
});

const Project = t.type({
  name: t.string,
  tests: t.type({
    items: t.array(
      t.type({
        location: t.union([t.literal("master"), t.literal("branch")]),
        status: t.string,
        createdAt: t.string, //DateFromString,
        commitHash: t.string,
      })
    ),
  }),
});

const ProjectWithTeamName = t.intersection([
  Project,
  t.type({ teamName: t.string }),
]);

type IProjectWithTeamName = t.TypeOf<typeof ProjectWithTeamName>;

const Team = t.type({
  image: t.type({
    downloadUrl: t.string,
  }),
  name: t.string,
  project: t.type({
    items: t.array(Project),
  }),
});

type ITeam = t.TypeOf<typeof Team>;

const queryTp = t.type({
  user: t.type({
    team: t.type({
      items: t.array(Team),
    }),
  }),
});

type QueryTp = t.TypeOf<typeof queryTp>;

const getProject = (teamName: string, projectName: string) => async (
  session: ISession
): Promise<E.Either<NegativeProjectFetchOutcome, IProjectWithTeamName>> =>
  pipe(
    TE.tryCatch(
      () =>
        new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
          headers: {
            authorization: `Bearer ${session.idToken}`,
          },
        }).request(
          `query(
            $teamName: String!
            $projectName:String!
          ) {
            user {
              team(filter:{
                name: {
                  equals: $teamName
                }
              }) {
                items{
                  image {
                    downloadUrl
                  }
                  name
                  project(filter:{
                    name: {
                      equals: $projectName
                    }
                  }) {
                    items {
                      name
                      tests {
                        items {
                          location
                          status
                          createdAt
                          commitHash
                        }
                      }
                    }
                  }
                }
              }
            }
          }`,
          { teamName, projectName }
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
      flow(
        Lens.fromPath<QueryTp>()(["user", "team", "items"]).get,
        A.head,
        E.fromOption(TEAM_DOES_NOT_EXIST),
        E.chain((team) =>
          pipe(
            team,
            Lens.fromPath<ITeam>()(["project", "items"]).get,
            A.head,
            E.fromOption(PROJECT_DOES_NOT_EXIST),
            E.chain((project) => E.either.of({ ...project, teamName: team.name }))
          )
        )
      )
    )
  )();

const userType = t.type({ id: t.string });

export const getServerSideProps = ({
  params: { teamName, projectName },
  req,
}): Promise<{ props: IProjectWithTeamName }> =>
  pipe(
    TE.tryCatch(() => auth0().getSession(req), NOT_LOGGED_IN),
    TE.chain(_TE.fromNullable(NOT_LOGGED_IN())),
    TE.chain(
      pipe(
        _RTE.tryToEitherCatch(confirmOrCreateUser("id", userType), UNDEFINED_ERROR),
        _RTE.voidChain(
          _RTE.tryToEitherCatch(getProject(teamName, projectName), UNDEFINED_ERROR)
        ),
        RTE.chainEitherK((props) => E.right({ props }))
      )
    )
  )().then(_E.eitherAsPromise);

export default (projectProps: IProjectWithTeamName) => (
  <>
    <Grid
      templateColumns="repeat(3, 1fr)"
      templateRows="repeat(2, minmax(204px, 45%))"
      gap={8}
    >
      <Settings
        organizationName={projectProps.teamName}
        repositoryName={projectProps.name}
      />
      <Production
        tests={projectProps.tests.items.filter(
          (test) => test.location === "master"
        )}
      />
      <Branch
        tests={projectProps.tests.items.filter(
          (test) => test.location === "branch"
        )}
      />
      <Chart />
    </Grid>
  </>
);
