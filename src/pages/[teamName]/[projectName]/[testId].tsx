import React, { useState } from "react";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import {
  Accordion,
  Box,
  Code,
  Grid,
  Heading,
  Text,
  useColorMode,
  Link,
  Flex,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/core";
import { StarIcon } from "../../../theme/icons";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as _RTE from "../../../fp-ts/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import Card from "../../../components/molecules/card";
import { withError } from "../../../components/molecules/error";
import FailureMessage from "../../../components/molecules/failureMessage";
import LogItem from "../../../components/molecules/logItem";
import * as _E from "../../../fp-ts/Either";
import { LensTaskEither, lensTaskEitherHead } from "../../../monocle-ts";
import { versionTriage } from "../../../utils/testLog";
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
          restLogs: p.logs.commands.filter(
            (a) =>
              a.exchange[0].meta.apiType === "rest" ||
              a.exchange[0].meta.apiType === undefined
          ),
          graphqlLogs: p.logs.commands.filter(
            (a) => a.exchange[0].meta.apiType === "graphql"
          ),
          failures: p.logs.commands.filter((a) => a.success === false),
        }),
        (p) => ({
          ...p,
          restFailures: p.failures.filter(
            (b) =>
              b.exchange[0].meta.apiType === "rest" ||
              b.exchange[0].meta.apiType === undefined
          ),
          graphqlFailures: p.failures.filter(
            (b) => b.exchange[0].meta.apiType === "graphql"
          ),
        }),
        ({
          colorMode,
          restFailures,
          graphqlFailures,
          graphqlLogs,
          restLogs,
          index: [index, setIndex],
        }) => (
          <Grid
            templateColumns="repeat(3, 1fr)"
            templateRows="repeat(2, minmax(204px, 45%))"
            gap={8}
          >
            <Card gridArea="1 / 2 / 4 / 1" heading="Tests">
              {index === 0 ? (
                restLogs.map((item, index) => (
                  <LogItem
                    key={index}
                    success={item.success}
                    path={item.exchange[0].meta.path}
                    method={item.exchange[0].request.method.toUpperCase()}
                  />
                ))
              ) : index === 1 ? (
                graphqlLogs.map((item, index) => (
                  <LogItem
                    key={index}
                    success={item.success}
                    path={item.exchange[0].meta.path}
                    method={
                      JSON.parse(item.exchange[0].request.body)[
                        "query"
                      ].startsWith("query")
                        ? "QUERY"
                        : JSON.parse(item.exchange[0].request.body)[
                            "query"
                          ].startsWith("mutation")
                        ? "MUTATION"
                        : JSON.parse(item.exchange[0].request.body)[
                            "query"
                          ].startsWith("subscription")
                        ? "SUBSCRIPTION"
                        : item.exchange[0].request.method.toUpperCase()
                    }
                  />
                ))
              ) : (
                <div>No endpoints were picked up during this test.</div>
              )}
            </Card>

            <Box gridArea="1 / 4 / 4 / 2" maxH="80vh" overflow="auto">
              <Flex justify="space-between" wrap="wrap">
                <SegmentedControl
                  currentIndex={index}
                  options={["RESTful", "GraphQL"]}
                  index={index}
                  setIndex={setIndex}
                />
                <Heading
                  mb={4}
                  color={`mode.${colorMode}.title`}
                  fontWeight={900}
                  fontSize="xl"
                >
                  {restFailures.length + graphqlFailures.length} Test Failure
                  {restFailures.length + graphqlFailures.length === 1
                    ? null
                    : "s"}
                  {testType === "Premium" ? (
                    <Code ml={2} fontSize="inherit" colorScheme="yellow">
                      <StarIcon mr={2} />
                      {testType}
                    </Code>
                  ) : (
                    <Code
                      ml={2}
                      fontSize="inherit"
                      colorScheme={
                        status === "In progress"
                          ? "yellow"
                          : status === "Passing"
                          ? "cyan"
                          : status === "Failed"
                          ? "red"
                          : null
                      }
                    >
                      {location}@
                      <Link
                        href={`https://github.com/${teamName}/${projectName}/commit/${commitHash}`}
                        color="inherit"
                      >
                        {commitHash.slice(0, 7)}
                      </Link>
                    </Code>
                  )}
                </Heading>
              </Flex>

              {index === 0 ? (
                restFailures.length > 0 ? (
                  restFailures.map((item, index) => (
                    <FailureMessage
                      key={index}
                      error_message={item.error_message}
                      priority={item.priority}
                      comment={item.comment}
                      exchange={item.exchange[0]}
                      method={item.exchange[0].request.method}
                    />
                  ))
                ) : (
                  <Text color={`mode.${colorMode}.text`}>
                    No bugs found here!
                  </Text>
                )
              ) : index === 1 ? (
                graphqlFailures.length > 0 ? (
                  graphqlFailures.map((item, index) => (
                    <FailureMessage
                      key={index}
                      error_message={item.error_message}
                      priority={item.priority}
                      comment={item.comment}
                      exchange={item.exchange[0]}
                      method={
                        JSON.parse(item.exchange[0].request.body)[
                          "query"
                        ].startsWith("query")
                          ? "QUERY"
                          : JSON.parse(item.exchange[0].request.body)[
                              "query"
                            ].startsWith("mutation")
                          ? "MUTATION"
                          : JSON.parse(item.exchange[0].request.body)[
                              "query"
                            ].startsWith("subscription")
                          ? "SUBSCRIPTION"
                          : item.exchange[0].request.method.toUpperCase()
                      }
                    />
                  ))
                ) : (
                  <Text color={`mode.${colorMode}.text`}>
                    No bugs found here!
                  </Text>
                )
              ) : null}
            </Box>
          </Grid>
        )
      )
    )
);

export default TestPage;
