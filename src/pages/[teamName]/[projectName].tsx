import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { Grid } from "@chakra-ui/core";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import ErrorComponent from "../../components/molecules/error";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
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
import { confirmOrCreateUser } from "../../utils/user";
import {
  defaultGQLErrorHandler,
  INCORRECT_TYPE_SAFETY,
  NOT_LOGGED_IN,
  TEAM_DOES_NOT_EXIST,
  PROJECT_DOES_NOT_EXIST,
  UNDEFINED_ERROR,
  INVALID_TOKEN_ERROR,
  GET_SERVER_SIDE_PROPS_ERROR,
} from "../../utils/error";
import { retrieveSession } from "../api/session";

type NegativeProjectFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | PROJECT_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | INCORRECT_TYPE_SAFETY;

const Project = t.type({
  name: t.string,
  configured: t.boolean,
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
  image: t.union([
    t.null,
    t.type({
      downloadUrl: t.string,
    }),
  ]),
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
                      configured
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
      (error): NegativeProjectFetchOutcome =>
        defaultGQLErrorHandler("getProject query")(error)
    ),
    TE.chainEitherK(
      flow(
        queryTp.decode,
        E.mapLeft(
          (errors): NegativeProjectFetchOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not decode team name query",
            errors,
          })
        )
      )
    ),
    TE.chainEitherK(
      flow(
        Lens.fromPath<QueryTp>()(["user", "team", "items"]).get,
        A.head,
        E.fromOption(
          (): NegativeProjectFetchOutcome => ({
            type: "TEAM_DOES_NOT_EXIST",
            msg: `Could not find team for: ${teamName} ${projectName}`,
          })
        ),
        E.chain((team) =>
          pipe(
            team,
            Lens.fromPath<ITeam>()(["project", "items"]).get,
            A.head,
            E.fromOption(
              (): NegativeProjectFetchOutcome => ({
                type: "PROJECT_DOES_NOT_EXIST",
                msg: `Could not find project for: ${teamName} ${projectName}`,
              })
            ),
            E.chain((project) => E.right({ ...project, teamName: team.name }))
          )
        )
      )
    )
  )();

const userType = t.type({ id: t.string });

export const getServerSideProps = ({
  params: { teamName, projectName },
  req,
  res,
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, IProjectWithTeamName>;
}> =>
  pipe(
    retrieveSession(req, "[projecName].tsx getServerSideProps"),
    TE.chain(
      pipe(
        _RTE.tryToEitherCatch(
          confirmOrCreateUser("id", userType),
          (error): NegativeProjectFetchOutcome => ({
            type: "UNDEFINED_ERROR",
            msg:
              "Unanticipated confirm or create user error in [projectName].tsx",
            error,
          })
        ),
        _RTE.voidChain(
          _RTE.tryToEitherCatch(
            getProject(teamName, projectName),
            (error): NegativeProjectFetchOutcome => ({
              type: "UNDEFINED_ERROR",
              msg: "Unanticipated getProject error",
              error,
            })
          )
        )
      )
    )
  )().then(_E.eitherSanitizedWithGenericError);

export default (
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, IProjectWithTeamName>
) =>
  pipe(
    props,
    E.fold(
      () => (
        <ErrorComponent
          errorMessage={
            "Uh oh. It looks like this resource does not exist! If you suspect it should, please reach out using the Intercom below."
          }
        />
      ),
      (projectProps) => (
        <>
          <Grid
            templateColumns="repeat(3, 1fr)"
            templateRows="repeat(2, minmax(204px, 45%))"
            gap={8}
          >
            <Settings
              organizationName={projectProps.teamName}
              repositoryName={projectProps.name}
              configured={projectProps.configured}
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
      )
    )
  );
