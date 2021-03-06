import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { Grid } from "@chakra-ui/core";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import React from "react";
import Branch from "../../components/Dashboard/branch";
import Chart from "../../components/Dashboard/chart";
import Premium from "../../components/Dashboard/premium";
import Settings from "../../components/Dashboard/settings";
import { withError } from "../../components/molecules/error";
import * as _E from "../../fp-ts/Either";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import { LensTaskEither, lensTaskEitherHead } from "../../monocle-ts";
import {
  defaultGQLErrorHandler,
  GET_SERVER_SIDE_PROPS_ERROR,
  INCORRECT_TYPE_SAFETY,
  INVALID_TOKEN_ERROR,
  NOT_LOGGED_IN,
  PROJECT_DOES_NOT_EXIST,
  TEAM_DOES_NOT_EXIST,
  UNDEFINED_ERROR,
  UNKNOWN_GRAPHQL_ERROR,
} from "../../utils/error";
import { confirmOrCreateUser } from "../../utils/user";
import { retrieveSession } from "../api/session";
import { GET_PROJECT_QUERY } from "../../gql/pages/[teamName]/[projectName]";
import { eightBaseClient } from "../../utils/graphql";

type NegativeProjectFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | PROJECT_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNKNOWN_GRAPHQL_ERROR
  | UNDEFINED_ERROR
  | INCORRECT_TYPE_SAFETY;

const Project = t.type({
  name: t.string,
  configuration: t.union([t.null, t.any]),
  repository: t.type({
    id: t.number,
    owner: t.string,
  }),
  tests: t.type({
    items: t.array(
      t.type({
        location: t.string,
        status: t.string,
        createdAt: t.string,
        commitHash: t.string,
        id: t.string,
        testType: t.string,
      })
    ),
  }),
});

type IProject = t.TypeOf<typeof Project>;

const ProjectWithTeamName = t.intersection([
  Project,
  t.type({ teamName: t.string }),
]);

type IProjectWithTeamName = t.TypeOf<typeof ProjectWithTeamName> & {
  session: ISession;
};

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

const getProject = (teamName: string, projectName: string) => (
  session: ISession
): TE.TaskEither<NegativeProjectFetchOutcome, IProjectWithTeamName> =>
  pipe(
    TE.tryCatch(
      () =>
        eightBaseClient(session).request(GET_PROJECT_QUERY, {
          teamName,
          projectName,
        }),
      defaultGQLErrorHandler("getProject query")
    ),
    LensTaskEither.fromPath<NegativeProjectFetchOutcome, QueryTp>()([
      "user",
      "team",
      "items",
    ])
      .compose(
        lensTaskEitherHead<NegativeProjectFetchOutcome, ITeam>(
          TE.left({
            type: "TEAM_DOES_NOT_EXIST",
            msg: `Could not find team for: ${teamName} ${projectName}`,
          })
        )
      )
      .compose(
        LensTaskEither.fromPath<NegativeProjectFetchOutcome, ITeam>()([
          "project",
          "items",
        ])
      )
      .compose(
        lensTaskEitherHead<NegativeProjectFetchOutcome, IProject>(
          TE.left({
            type: "PROJECT_DOES_NOT_EXIST",
            msg: `Could not find project for: ${teamName} ${projectName}`,
          })
        )
      ).get,
    TE.chain((project) => TE.right({ ...project, session, teamName: teamName }))
  );

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
        confirmOrCreateUser("id", userType),
        RTE.chain(() => getProject(teamName, projectName))
      )
    )
  )().then(_E.eitherSanitizedWithGenericError);

export default withError<GET_SERVER_SIDE_PROPS_ERROR, IProjectWithTeamName>(
  "Uh oh. It looks like this resource does not exist!",
  (projectProps) => (
    <>
      <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(2, minmax(204px, 45%))"
        gap={8}
      >
        <Settings
          session={projectProps.session}
          teamName={projectProps.teamName}
          repositoryName={projectProps.name}
          repositoryId={projectProps.repository.id}
          repositoryOwner={projectProps.repository.owner}
          configured={projectProps.configuration ? true : false}
        />
        <Premium
          session={projectProps.session}
          teamName={projectProps.teamName}
          projectName={projectProps.name}
          tests={projectProps.tests.items.filter(
            (test) => test.testType == "Premium"
          )}
        />
        <Branch
          session={projectProps.session}
          teamName={projectProps.teamName}
          projectName={projectProps.name}
          tests={projectProps.tests.items.filter(
            (test) => test.testType == "Standard"
          )}
        />
        <Chart session={projectProps.session} />
      </Grid>
    </>
  )
);
