import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import {
  Accordion,
  Box,
  Code,
  Grid,
  Heading,
  Text,
  useColorMode,
} from "@chakra-ui/core";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import { GraphQLClient } from "graphql-request";
import * as t from "io-ts";
import React from "react";
import Card from "../../../components/molecules/card";
import { withError } from "../../../components/molecules/error";
import FailureMessage from "../../../components/molecules/failureMessage";
import LogItem from "../../../components/molecules/logItem";
import * as _E from "../../../fp-ts/Either";
import { LensTaskEither, lensTaskEitherHead } from "../../../monocle-ts";
import { withSession } from "../../../pages/api/session";
import {
  defaultGQLErrorHandler,
  GET_SERVER_SIDE_PROPS_ERROR,
  INCORRECT_TYPE_SAFETY,
  INVALID_TOKEN_ERROR,
  NOT_LOGGED_IN,
  PROJECT_DOES_NOT_EXIST,
  TEAM_DOES_NOT_EXIST,
  TEST_DOES_NOT_EXIST,
  UNDEFINED_ERROR,
  UNKNOWN_GRAPHQL_ERROR,
} from "../../../utils/error";
import { confirmOrCreateUser } from "../../../utils/user";
import { GET_TEST_QUERY } from "../../../gql/pages/[teamName]/[projectName]/[testId]";
import { eightBaseClient } from "../../../utils/graphql";

type NegativeTestFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | UNKNOWN_GRAPHQL_ERROR
  | PROJECT_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | TEST_DOES_NOT_EXIST
  | INCORRECT_TYPE_SAFETY;

const TestT = t.type({
  commitHash: t.string,
  status: t.string,
  location: t.string,
  log: t.union([t.string, t.null]),
});

type ITestT = t.TypeOf<typeof TestT>;

type ITestProps = {
  session: ISession;
  test: ITestT;
  teamName: string;
  projectName: string;
  testID: string;
  id: string;
};

const Project = t.type({
  name: t.string,
  tests: t.type({
    items: t.array(TestT),
  }),
});

type IProject = t.TypeOf<typeof Project>;

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

const getTest = (teamName: string, projectName: string, testID: string) => (
  session: ISession
): TE.TaskEither<NegativeTestFetchOutcome, ITestT> =>
  pipe(
    TE.tryCatch<NegativeTestFetchOutcome, any>(
      () =>
        eightBaseClient(session).request(GET_TEST_QUERY, {
          teamName,
          projectName,
          testID,
        }),
      defaultGQLErrorHandler("getTest query")
    ),
    LensTaskEither.fromPath<NegativeTestFetchOutcome, QueryTp>()([
      "user",
      "team",
      "items",
    ])
      .compose(
        lensTaskEitherHead<NegativeTestFetchOutcome, ITeam>(
          TE.left({
            type: "TEAM_DOES_NOT_EXIST",
            msg: `Could not find team for: ${teamName} ${projectName} ${testID}`,
          })
        )
      )
      .compose(
        LensTaskEither.fromPath<NegativeTestFetchOutcome, ITeam>()([
          "project",
          "items",
        ])
      )
      .compose(
        lensTaskEitherHead<NegativeTestFetchOutcome, IProject>(
          TE.left({
            type: "PROJECT_DOES_NOT_EXIST",
            msg: `Could not find project for: ${teamName} ${projectName} ${testID}`,
          })
        )
      )
      .compose(
        LensTaskEither.fromPath<NegativeTestFetchOutcome, IProject>()([
          "tests",
          "items",
        ])
      )
      .compose(
        lensTaskEitherHead<NegativeTestFetchOutcome, ITestT>(
          TE.left({
            type: "TEST_DOES_NOT_EXIST",
            msg: `Could not find test for: ${teamName} ${projectName} ${testID}`,
          })
        )
      ).get
  );

const userType = t.type({ id: t.string });
type UserType = t.TypeOf<typeof userType>;

export const getServerSideProps = ({
  params: { teamName, projectName, testId },
  req,
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, ITestProps>;
}> =>
  pipe(
    confirmOrCreateUser("id", userType),
    RTE.chain(({ id }) =>
      flow(
        getTest(teamName, projectName, testId),
        TE.chain((test) => TE.right({ test, id }))
      )
    ),
    RTE.chain(({ id, test }) => (session) =>
      TE.right<NegativeTestFetchOutcome, ITestProps>({
        session,
        id,
        test,
        teamName,
        testID: testId,
        projectName,
      })
    ),
    withSession<NegativeTestFetchOutcome, ITestProps>(
      req,
      "configuration.tsx getServerSideProps"
    )
  )().then(_E.eitherSanitizedWithGenericError);

const TestPage = withError<GET_SERVER_SIDE_PROPS_ERROR, ITestProps>(
  "Could not find this test resource.",
  ({ test: { log, location, commitHash, status } }) =>
    status === "In progress" ? (
      <div>Your tests are currently in progress.</div>
    ) : JSON.parse(log)['build-error'] ? (
      <div>Oh no! It looks like we couldn't build your repository for testing. Please consult the build log <a href={JSON.parse(log)['build-error']}>here</a>.</div>
    ) :
        pipe(
          {
            colorMode: useColorMode().colorMode,
            logs: JSON.parse(log),
          },
          (p) => ({
            ...p,
            failures: p.logs.commands.filter((a) => a.success === false),
          }),
          ({ colorMode, logs, failures }) => (
            <Grid
              templateColumns="repeat(3, 1fr)"
              templateRows="repeat(2, minmax(204px, 45%))"
              gap={8}
            >
              <Card gridArea="1 / 2 / 4 / 1" heading="Tests">
                {logs.commands.map((item, index) => (
                  <LogItem
                    key={index}
                    success={item.success}
                    path={item.path}
                    method={item.method}
                  />
                ))}
              </Card>
              <Box gridArea="1 / 4 / 4 / 2">
                <Heading
                  mb={4}
                  color={`mode.${colorMode}.title`}
                  fontWeight={900}
                  fontSize="xl"
                >
                  Test Failures
                <Code
                    ml={2}
                    fontSize="inherit"
                    variantColor={
                      status === "In progress"
                        ? "yellow"
                        : status === "Passing"
                          ? "cyan"
                          : status === "Failed"
                            ? "red"
                            : null
                    }
                  >{`${location}@${commitHash.slice(0, 7)}`}</Code>
                </Heading>
                <Accordion w="full" defaultIndex={[0]} allowMultiple>
                  {failures.length > 0 ? (
                    failures.map((item, index) => (
                      <FailureMessage
                        key={index}
                        method={item.method}
                        path={item.path}
                        headers={item.headers}
                        query={item.query}
                      />
                    ))
                  ) : (
                      <Text color={`mode.${colorMode}.text`}>
                        No bugs found here!
                      </Text>
                    )}
                </Accordion>
              </Box>
            </Grid>
          )
        )

);

export default TestPage;
