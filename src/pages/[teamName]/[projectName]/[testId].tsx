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
import ErrorComponent from "../../../components/molecules/error";
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
} from "../../../utils/error";
import { confirmOrCreateUser } from "../../../utils/user";

type NegativeTestFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | PROJECT_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | TEST_DOES_NOT_EXIST
  | INCORRECT_TYPE_SAFETY;

const TestT = t.type({
  commitHash: t.string,
  status: t.string,
  location: t.string,
  log: t.string,
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
        new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
          headers: {
            authorization: `Bearer ${session.idToken}`,
          },
        }).request(
          `query(
            $teamName: String!
            $projectName:String!
            $testID:ID!
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
                        tests(filter:{
                          id: {
                            equals:$testID
                          }
                        }) {
                          items{
                            commitHash
                            status
                            location
                            log
                          }
                        }
                      }
                    }
                  }
                }
              }
            }`,
          { teamName, projectName, testID }
        ),
      (error): NegativeTestFetchOutcome =>
        defaultGQLErrorHandler("getTest query")(error)
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

const TestPage = (props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, ITestProps>) =>
  pipe(
    props,
    E.fold(
      () => (
        <ErrorComponent
          errorMessage={"Could not find this test resource."}
        ></ErrorComponent>
      ),
      ({ test: { log, location, commitHash } }) => {
        const { colorMode } = useColorMode();
        const logs = JSON.parse(log);
        var failures = logs.commands.filter((a) => a.success === false);
        return (
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
                  variantColor="red"
                >{`${location}@${commitHash}`}</Code>
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
        );
      }
    )
  );

export default TestPage;
