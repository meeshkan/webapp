import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import {
  Grid,
  Heading,
  Icon,
  Image,
  Link as ChakraLink,
  Stack,
  Text,
  useColorMode,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Flex,
  Code,
} from "@chakra-ui/core";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import Link from "next/link";
import React from "react";
import Card from "../components/molecules/card";
import { withError } from "../components/molecules/error";
import * as _E from "../fp-ts/Either";
import { GET_TEAM_QUERY } from "../gql/pages/[teamName]";
import { LensTaskEither, lensTaskEitherHead } from "../monocle-ts";
import {
  defaultGQLErrorHandler,
  GET_SERVER_SIDE_PROPS_ERROR,
  INCORRECT_TYPE_SAFETY,
  INVALID_TOKEN_ERROR,
  NOT_LOGGED_IN,
  TEAM_DOES_NOT_EXIST,
  UNDEFINED_ERROR,
  UNKNOWN_GRAPHQL_ERROR,
} from "../utils/error";
import { eightBaseClient } from "../utils/graphql";
import { confirmOrCreateUser } from "../utils/user";
import { withSession } from "./api/session";
import { getGHOAuthState } from "../utils/oauth";

type NegativeTeamFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | UNKNOWN_GRAPHQL_ERROR
  | INCORRECT_TYPE_SAFETY
  | INCORRECT_TYPE_SAFETY;

const Team = t.type({
  image: t.union([
    t.null,
    t.type({
      downloadUrl: t.string,
    }),
  ]),
  name: t.string,
  users: t.type({
    items: t.array(
      t.type({
        email: t.string,
        status: t.string,
        avatar: t.union([
          t.null,
          t.type({
            downloadUrl: t.string,
          }),
        ]),
      })
    ),
  }),
  project: t.type({
    items: t.array(
      t.type({
        name: t.string,
        repository: t.union([
          t.null,
          t.type({
            owner: t.string,
          }),
        ]),
        configuration: t.union([
          t.null,
          t.type({
            id: t.string,
          }),
        ]),
      })
    ),
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

const getTeam = (teamName: string) => (
  session: ISession
): TE.TaskEither<NegativeTeamFetchOutcome, ITeam> =>
  pipe(
    TE.tryCatch(
      () => eightBaseClient(session).request(GET_TEAM_QUERY, { teamName }),
      defaultGQLErrorHandler("get team query")
    ),
    TE.chainEitherK(
      flow(
        queryTp.decode,
        E.mapLeft(
          (errors): NegativeTeamFetchOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not decode team name query",
            errors,
          })
        )
      )
    ),
    LensTaskEither.fromPath<NegativeTeamFetchOutcome, QueryTp>()([
      "user",
      "team",
      "items",
    ]).compose(
      lensTaskEitherHead<NegativeTeamFetchOutcome, ITeam>(
        TE.left({
          type: "TEAM_DOES_NOT_EXIST",
          msg: `Could not find team for: ${teamName}`,
        })
      )
    ).get
  );

type ITeamProps = { team: ITeam; session: ISession; ghOauthState: string };

const userType = t.type({ id: t.string });

export const getServerSideProps = ({
  params: { teamName },
  req,
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, ITeamProps>;
}> =>
  pipe(
    confirmOrCreateUser("id", userType),
    RTE.chain((_) => getTeam(teamName)),
    RTE.chain((team) =>
      pipe(
        getGHOAuthState,
        RTE.fromReaderEither,
        RTE.chain((ghOauthState) => RTE.right({ ghOauthState, team }))
      )
    ),
    RTE.chain((p) => (session) => TE.right({ session, ...p })),
    withSession(req, "[teamName].tsx getServerSideProps")
  )().then(_E.eitherSanitizedWithGenericError);

export default withError<GET_SERVER_SIDE_PROPS_ERROR, ITeamProps>(
  "Uh oh. Looks like this resource does not exist.",
  ({ team, session, ghOauthState }) =>
    pipe(useColorMode(), ({ colorMode }) => (
      <>
        <Grid
          templateColumns="repeat(3, 1fr)"
          templateRows="repeat(2, 1fr)"
          gap={8}
        >
          <Card gridArea="1 / 1 / 2 / 2" heading="Team settings">
            <Text>example</Text>
          </Card>
          <Card
            gridArea="2 / 1 / 3 / 2"
            heading={`Team members - ${team.users.items.length}`}
          >
            <FormControl>
              <FormLabel
                fontWeight={500}
                color={`mode.${colorMode}.title`}
                mt={4}
              >
                Email
              </FormLabel>
              <Stack isInline>
                <Input
                  borderColor={`mode.${colorMode}.icon`}
                  color={`mode.${colorMode}.text`}
                  rounded="sm"
                  size="sm"
                  name="directory"
                />
                <Button
                  size="sm"
                  px={4}
                  rounded="sm"
                  fontWeight={900}
                  variantColor="blue"
                  type="submit"
                >
                  Invite
                </Button>
              </Stack>
            </FormControl>
            {team.users.items.map((user, index) => (
              <Stack
                key={index}
                isInline
                align="center"
                mt={4}
                justify="space-between"
              >
                <Stack align="center" isInline>
                  <Image
                    src={
                      user.avatar
                        ? user.avatar.downloadUrl
                        : "https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
                    }
                    rounded="full"
                    size={8}
                    border="1px solid"
                    borderColor={`mode.${colorMode}.icon`}
                  />
                  <Text>{user.email}</Text>
                </Stack>
                <Text color="gray.500" fontStyle="italic">
                  {user.status}
                </Text>
              </Stack>
            ))}
          </Card>
          <Box gridArea="1 / 2 / 3 / 4">
            <Grid templateColumns="repeat(2, 1fr)" gap={8}>
              {team.project.items.map((project, index) => (
                <Card
                  key={index}
                  link={`/${team.name}/${project.name}`}
                  linkLabel={`Links to ${team.name}'s project ${project.name}`}
                >
                  <Stack spacing={2}>
                    <Flex align="center" justify="space-between">
                      <Text color={`mode.${colorMode}.text`} lineHeight="none">
                        {project.repository.owner}
                      </Text>
                      {project.configuration && (
                        <Code variantColor="cyan" fontWeight={700} rounded="sm">
                          configured
                        </Code>
                      )}
                    </Flex>
                    <Heading
                      as="h3"
                      lineHeight="none"
                      fontSize="md"
                      fontWeight={900}
                    >
                      {project.name}
                    </Heading>
                  </Stack>
                </Card>
              ))}
              <ChakraLink
                href={`https://github.com/apps/meeshkan/installations/new?state=${ghOauthState}`}
                aria-label="Link to GitHub to install meeshkan on a repository"
                bg={`mode.${colorMode}.card`}
                p={4}
                rounded="sm"
                color={`mode.${colorMode}.title`}
                _hover={{ color: `mode.${colorMode}.titleHover` }}
              >
                <Stack spacing={4} align="center" isInline>
                  <Icon h={10} w={10} name="add" stroke="2px" />
                  <Heading
                    as="h3"
                    lineHeight="none"
                    fontSize="md"
                    fontWeight={900}
                  >
                    Import a project
                  </Heading>
                </Stack>
              </ChakraLink>
            </Grid>
          </Box>
        </Grid>
      </>
    ))
);
