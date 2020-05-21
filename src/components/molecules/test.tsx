import React from "react";
import { Stack, Text, Badge, Box, useColorMode } from "@chakra-ui/core";
import dayjs from "dayjs";
import Link from "next/link";
import {
  NOT_LOGGED_IN,
  TEAM_DOES_NOT_EXIST,
  PROJECT_DOES_NOT_EXIST,
  INVALID_TOKEN_ERROR,
  TEST_DOES_NOT_EXIST,
  UNDEFINED_ERROR,
  INCORRECT_TYPE_SAFETY,
  defaultGQLErrorHandler,
} from "../../utils/error";
import { Lens } from "monocle-ts";
import * as t from "io-ts";
import * as A from "fp-ts/lib/Array";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as E from "fp-ts/lib/Either";
import { GraphQLClient } from "graphql-request";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { flow } from "fp-ts/lib/function";

type NegativeTestFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | PROJECT_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | TEST_DOES_NOT_EXIST
  | INCORRECT_TYPE_SAFETY;

const Configuration = t.type({
  buildCommand: t.union([t.null, t.string]),
  openAPISpec: t.union([t.null, t.string]),
  directory: t.union([t.null, t.string]),
});

type IConfiguration = t.TypeOf<typeof Configuration>;

type IConfigurationProps = {
  session: ISession;
  configuration?: IConfiguration;
  teamName: string;
  projectName: string;
  id: string;
};

const Project = t.type({
  name: t.string,
  configuration: t.union([t.null, Configuration]),
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
const getTest = (teamName: string, projectName: string) => async (
  session: ISession
): Promise<E.Either<NegativeTestFetchOutcome, IConfiguration>> =>
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
                      configuration{
                        buildCommand
                        openAPISpec
                        directory
                      }
                    }
                  }
                }
              }
            }
          }`,
          { teamName, projectName }
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
    TE.chainEitherK<NegativeTestFetchOutcome, QueryTp, IConfiguration>(
      flow(
        Lens.fromPath<QueryTp>()(["user", "team", "items"]).get,
        A.head,
        E.fromOption(
          (): NegativeTestFetchOutcome => ({
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
              (): NegativeTestFetchOutcome => ({
                type: "PROJECT_DOES_NOT_EXIST",
                msg: `Could not find project for: ${teamName} ${projectName}`,
              })
            ),
            E.chain((project) =>
              pipe(
                project,
                Lens.fromPath<IProject>()(["configuration"]).get,
                O.fromNullable,
                O.getOrElse<IConfiguration>(() => ({
                  buildCommand: null,
                  openAPISpec: null,
                  directory: null,
                })),
                (configuration) => E.right(configuration)
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
  params: { teamName, projectName },
  req,
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, IConfigurationProps>;
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
          { id: string; configuration: IConfiguration }
        >(({ id }) =>
          _RTE.tryToEitherCatch<
            ISession,
            NegativeTestFetchOutcome,
            { id: string; configuration: IConfiguration }
          >(
            flow(
              getTest(teamName, projectName),
              constant,
              TE.chain((configuration) => TE.right({ configuration, id })),
              thunk
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
          { id: string; configuration: IConfiguration },
          IConfigurationProps
        >(({ id, configuration }) => (session) =>
          E.right<NegativeTestFetchOutcome, IConfigurationProps>({
            session,
            id,
            configuration,
            teamName,
            projectName,
          })
        )
      )
    )
  )().then(_E.eitherSanitizedWithGenericError);

type TestProps = {
  branchName: string;
  date: string;
  status: string;
  commitHash: string;
  testId: string;
  teamName: string;
  projectName: string;
};

export const Test = ({
  commitHash,
  branchName,
  date,
  status,
  testId,
  teamName,
  projectName,
}: TestProps) => {
  const { colorMode } = useColorMode();
  return (
    <Link href={`/${teamName}/${projectName}/${testId}`}>
      <Box
        my={3}
        borderBottom="1px solid"
        borderColor={`mode.${colorMode}.icon`}
        cursor="pointer"
      >
        <Stack isInline>
          <Text
            fontWeight={600}
            lineHeight="normal"
            color={`mode.${colorMode}.title`}
          >
            {`${branchName}@${commitHash.slice(0, 7)}`}
          </Text>
          <Badge
            variantColor={
              status === "In progress"
                ? "yellow"
                : status === "Success"
                ? "cyan"
                : status === "Failed"
                ? "red"
                : null
            }
            fontWeight={600}
            rounded="sm"
            padding="0px 4px"
            minH="auto"
            mb={3}
            textTransform="none"
          >
            {status}
          </Badge>
        </Stack>

        <Text
          color={`mode.${colorMode}.text`}
          fontSize="sm"
          lineHeight="normal"
          mb={4}
        >
          {dayjs(date).format("MMM D hh:mma")}
        </Text>
      </Box>
    </Link>
  );
};
