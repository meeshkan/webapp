import React, { useState } from "react";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import {
  Box,
  Code,
  Grid,
  Heading,
  Text,
  useColorMode,
  Link,
  Flex,
} from "@chakra-ui/core";
import { StarIcon } from "../../../theme/icons";
import * as E from "fp-ts/lib/Either";
import * as NEA from "fp-ts/lib/NonEmptyArray";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as _RTE from "../../../fp-ts/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import Card from "../../../components/molecules/card";
import { withError } from "../../../components/molecules/error";
import Exchange from "../../../components/molecules/exchange";
import LogItem from "../../../components/molecules/logItem";
import * as _E from "../../../fp-ts/Either";
import { LensTaskEither, lensTaskEitherHead } from "../../../monocle-ts";
import { versionTriage, CommandType } from "../../../utils/testLog";
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
import { eightBaseClient, gqlOperatorName } from "../../../utils/graphql";
import Error from "../../../components/molecules/error";
import { SegmentedControl } from "../../../components/molecules/switch";

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
  testType: t.string,
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
    _RTE.seq2([
      confirmOrCreateUser("id", userType),
      getTest(teamName, projectName, testId),
    ]),
    RTE.chain(([{ id }, test]) => (session) =>
      TE.right({
        session,
        id,
        test,
        teamName,
        testID: testId,
        projectName,
      })
    ),
    withSession(req, "configuration.tsx getServerSideProps")
  )().then(_E.eitherSanitizedWithGenericError);

const smartItemTestCase = (ct: CommandType, i: number): string =>
  pipe(
    NEA.fromArray(ct.exchange),
    O.fold(
      () => "Test case " + i,
      (a) =>
        NEA.head(a).meta.apiType === "graphql"
          ? gqlOperatorName(NEA.head(a).request.body)
          : NEA.head(a).request.method.toUpperCase() +
            " " +
            NEA.head(a).meta.path
    )
  );

const TestPage = withError<GET_SERVER_SIDE_PROPS_ERROR, ITestProps>(
  "Could not find this test resource.",
  ({
    test: { log, location, commitHash, status, testType },
    teamName,
    projectName,
  }) =>
    status === "In progress" ? (
      <div>Your tests are currently in progress.</div>
    ) : JSON.parse(log)["build-error"] ? (
      <Error
        errorMessage={`It looks like we couldn't build your repository for testing. Please consult the bulid log ${
          JSON.parse(log)["build-error"]
        }`}
      />
    ) : (
      pipe(
        {
          colorMode: useColorMode().colorMode,
          logs: versionTriage(JSON.parse(log)),
          index: useState(0),
        },
        (p) => ({
          ...p,
          index: p.index[0],
          setIndex: p.index[1],
          failures: p.logs.commands.filter((c) => !c.success),
        }),
        ({ colorMode, logs, failures, index, setIndex }) => (
          <Grid
            templateColumns="repeat(3, 1fr)"
            templateRows="repeat(2, minmax(204px, 45%))"
            gap={8}
          >
            <Card
              gridArea="1 / 2 / 4 / 1"
              heading={`${testType} test cases — ${failures.length} failure${
                failures.length === 1 ? "" : "s"
              }`}
            >
              {logs.commands.length > 0 ? (
                logs.commands.map((item, i) => (
                  <LogItem
                    key={i}
                    i={i}
                    success={item.success}
                    path={item.test_case || smartItemTestCase(item, i)}
                    setIndex={setIndex}
                  />
                ))
              ) : (
                <div>No endpoints were picked up during this test.</div>
              )}
            </Card>

            <Box gridArea="1 / 4 / 4 / 2" maxH="80vh" overflow="auto">
              {testType !== "Premium" && (
                <Code
                  mb={4}
                  fontSize="xl"
                  fontWeight={900}
                  colorScheme={
                    status === "In progress"
                      ? "yellow"
                      : status === "Passing"
                      ? "cyan"
                      : status === "Failed"
                      ? "red"
                      : "gray"
                  }
                >
                  {location}
                  {` branch -> commit `}
                  <Link
                    href={`https://github.com/${teamName}/${projectName}/commit/${commitHash}`}
                    color="inherit"
                  >
                    {commitHash.slice(0, 7)}
                  </Link>
                </Code>
              )}

              {logs.commands[index] ? (
                <Exchange key={index} command={logs.commands[index]} />
              ) : (
                <Text color={`mode.${colorMode}.text`}>
                  No bugs found here!
                </Text>
              )}
            </Box>
          </Grid>
        )
      )
    )
);

export default TestPage;
