import React, { useState, useEffect } from "react";
import { Grid } from "@chakra-ui/core";
// cards
import auth0 from "../../utils/auth0";
// import { DateFromString, IDateFromString } from "../../utils/customTypes";
import Settings from "../../components/Dashboard/settings";
import Production from "../../components/Dashboard/production";
import Branch from "../../components/Dashboard/branch";
import Chart from "../../components/Dashboard/chart";
import { left, right, isLeft, Either, isRight } from "fp-ts/lib/Either";
import * as t from "io-ts";
import { GraphQLClient } from "graphql-request";
import { confirmOrCreateUser } from "../../utils/user";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { fold as oFold, chain } from "fp-ts/lib/Option";
import { fold as eFold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { head } from "fp-ts/lib/Array";

interface NOT_LOGGED_IN {
  type: "NOT_LOGGED_IN";
}
interface PROJECT_DOES_NOT_EXIST {
  type: "PROJECT_DOES_NOT_EXIST";
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

type NegativeProjectFetchOutcome =
  | NOT_LOGGED_IN
  | PROJECT_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | QUERY_ERROR;
  
const NOT_LOGGED_IN = (): NegativeProjectFetchOutcome => ({
  type: "NOT_LOGGED_IN",
});
const PROJECT_DOES_NOT_EXIST = (): NegativeProjectFetchOutcome => ({
  type: "PROJECT_DOES_NOT_EXIST",
});
const INVALID_TOKEN_ERROR = (): NegativeProjectFetchOutcome => ({
  type: "INVALID_TOKEN_ERROR",
});
const UNDEFINED_ERROR = (): NegativeProjectFetchOutcome => ({
  type: "UNDEFINED_ERROR",
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

type IProject = t.TypeOf<typeof Project>;

const Team = t.type({
  image: t.type({
    downloadUrl: t.string,
  }),
  project: t.type({
    items: t.array(Project),
  }),
});

const queryTp = t.type({
  user: t.type({
    team: t.type({
      items: t.array(Team),
    }),
  }),
});

type QueryTp = t.TypeOf<typeof queryTp>;

const getProject = async (
  session: ISession,
  teamName: string,
  projectName: string
): Promise<Either<NegativeProjectFetchOutcome, IProject>> => {
  const _8baseGraphQLClient = new GraphQLClient(
    process.env.EIGHT_BASE_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${session.idToken}`,
      },
    }
  );

  // TODO: create graphql query to get the project based projectName
  const query = `query(
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
  }`;

  try {
    return pipe(
      queryTp.decode(
        await _8baseGraphQLClient.request(query, {
          teamName,
          projectName,
        })
      ),
      eFold(
        () => left(QUERY_ERROR()),
        (query: QueryTp) =>
          pipe(
            head(query.user.team.items),
            chain((team) => head(team.project.items)),
            oFold(
              () => left(PROJECT_DOES_NOT_EXIST()),
              (a: IProject) => right(a)
            )
          )
      )
    );
  } catch (e) {
    if (
      e.response.errors.filter((error) => error.code === "InvalidTokenError")
        .length > 0
    ) {
      return left(INVALID_TOKEN_ERROR());
    }
    return left(UNDEFINED_ERROR());
  }
};

type IProjectProps = Either<
  NegativeProjectFetchOutcome,
  {
    teamName: string;
    projectName: string;
    project: IProject;
  }
>;

export async function getServerSideProps(
  context
): Promise<{ props: IProjectProps }> {
  console.log("Running server side props for project name");
  const {
    params: { teamName, projectName },
    req,
  } = context;
  const session = await auth0().getSession(req);
  if (!session) {
    return { props: left(NOT_LOGGED_IN()) };
  }

  const user = await confirmOrCreateUser(
    "id",
    session,
    t.type({ id: t.string })
  );
  if (isLeft(user)) {
    console.error("type safety error in application");
  }

  const project = await getProject(session, teamName, projectName);

  return {
    props: isLeft(project)
      ? left(project.left)
      : right({ teamName, projectName, project: project.right }),
  };
}

const Dashboard = (projectProps: IProjectProps) => {
  if (isLeft(projectProps)) {
    //useRouter().push("/404");
    return <>404</>;
  }
  return (
    <>
      <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(2, minmax(204px, 45%))"
        gap={8}
      >
        <Settings
          organizationName={projectProps.right.teamName}
          repositoryName={projectProps.right.projectName}
        />
        <Production
          tests={projectProps.right.project.tests.items.filter(
            (test) => test.location === "master"
          )}
        />
        <Branch
          tests={projectProps.right.project.tests.items.filter(
            (test) => test.location === "branch"
          )}
        />
        <Chart />
      </Grid>
    </>
  );
};

export default Dashboard;
