import React from "react";
import {
  Grid,
  Box,
  Accordion,
  Heading,
  useColorMode,
  Code,
  Text,
} from "@chakra-ui/core";
import Card from "../../../components/molecules/card";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { GraphQLClient } from "graphql-request";
import {
  NOT_LOGGED_IN,
  TEAM_DOES_NOT_EXIST,
  PROJECT_DOES_NOT_EXIST,
  INVALID_TOKEN_ERROR,
  TEST_DOES_NOT_EXIST,
  UNDEFINED_ERROR,
  INCORRECT_TYPE_SAFETY,
  defaultGQLErrorHandler,
  GET_SERVER_SIDE_PROPS_ERROR,
} from "../../../utils/error";
import { Lens } from "monocle-ts";
import * as t from "io-ts";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import * as _RTE from "../../../fp-ts/ReaderTaskEither";
import * as _E from "../../../fp-ts/Either";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { flow, constant } from "fp-ts/lib/function";
import { retrieveSession } from "../../../pages/api/session";
import { confirmOrCreateUser } from "../../../utils/user";
import ErrorComponent from "../../../components/molecules/error";
import LogItem from "../../../components/molecules/logItem";
import FailureMessage from "../../../components/molecules/failureMessage";

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
const getTest = (
  teamName: string,
  projectName: string,
  testID: string
) => async (
  session: ISession
): Promise<E.Either<NegativeTestFetchOutcome, ITestT>> =>
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
    TE.chainEitherK<NegativeTestFetchOutcome, any, QueryTp>(
      flow(
        queryTp.decode,
        E.mapLeft(
          (errors): NegativeTestFetchOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not decode team name query",
            errors,
          })
        )
      )
    ),
    TE.chainEitherK<NegativeTestFetchOutcome, QueryTp, ITestT>(
      flow(
        Lens.fromPath<QueryTp>()(["user", "team", "items"]).get,
        A.head,
        E.fromOption(
          (): NegativeTestFetchOutcome => ({
            type: "TEAM_DOES_NOT_EXIST",
            msg: `Could not find team for: ${teamName} ${projectName} ${testID}`,
          })
        ),
        E.chain((team) =>
          pipe(
            team,
            Lens.fromPath<ITeam>()(["project", "items"]).get,
            A.head,
            E.fromOption(
              (): NegativeTestFetchOutcome => ({
                type: "PROJECT_DOES_NOT_EXIST",
                msg: `Could not find project for: ${teamName} ${projectName} ${testID}`,
              })
            ),
            E.chain((project) =>
              pipe(
                project,
                Lens.fromPath<IProject>()(["tests", "items"]).get,
                A.head,
                E.fromOption(
                  (): NegativeTestFetchOutcome => ({
                    type: "TEST_DOES_NOT_EXIST",
                    msg: `Could not find test for: ${teamName} ${projectName} ${testID}`,
                  })
                )
              )
            )
          )
        )
      )
    )
  )();

const userType = t.type({ id: t.string });
type UserType = t.TypeOf<typeof userType>;

export const getServerSideProps = ({
  params: { teamName, projectName, testId },
  req,
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, ITestProps>;
}> =>
  pipe(
    retrieveSession(req, "configuration.tsx getServerSideProps"),
    TE.chain(
      pipe(
        _RTE.tryToEitherCatch<ISession, NegativeTestFetchOutcome, UserType>(
          confirmOrCreateUser("id", userType),
          (error): NegativeTestFetchOutcome => ({
            type: "UNDEFINED_ERROR",
            msg:
              "Unanticipated confirm or create user error in configuration.tsx",
            error,
          })
        ),
        RTE.chain<
          ISession,
          NegativeTestFetchOutcome,
          UserType,
          { id: string; test: ITestT }
        >(({ id }) =>
          _RTE.tryToEitherCatch<
            ISession,
            NegativeTestFetchOutcome,
            { id: string; test: ITestT }
          >(
            flow(
              getTest(teamName, projectName, testId),
              constant,
              TE.chain((test) => TE.right({ test, id })),
              (p) => p()
            ),
            (error): NegativeTestFetchOutcome => ({
              type: "UNDEFINED_ERROR",
              msg: "Unanticipated getTeam error",
              error,
            })
          )
        ),
        _RTE.chainEitherKWithAsk<
          ISession,
          NegativeTestFetchOutcome,
          { id: string; test: ITestT },
          ITestProps
        >(({ id, test }) => (session) =>
          E.right<NegativeTestFetchOutcome, ITestProps>({
            session,
            id,
            test,
            teamName,
            testID: testId,
            projectName,
          })
        )
      )
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
