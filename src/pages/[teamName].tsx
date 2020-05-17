import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { Grid, Heading, Icon, Image, Link as ChakraLink, Stack, Text, useColorMode } from "@chakra-ui/core";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { GraphQLClient } from "graphql-request";
import * as t from "io-ts";
import { Lens } from "monocle-ts";
import Link from "next/link";
import React from "react";
import Card from "../components/molecules/card";
import * as _E from "../fp-ts/Either";
import * as _RTE from "../fp-ts/ReaderTaskEither";
import * as _TE from "../fp-ts/TaskEither";
import auth0 from "../utils/auth0";
import { gqlRequestError } from "../utils/graphql";
import { confirmOrCreateUser, INCORRECT_TYPE_SAFETY } from "../utils/user";

interface NOT_LOGGED_IN {
  type: "NOT_LOGGED_IN";
}
interface TEAM_DOES_NOT_EXIST {
  type: "TEAM_DOES_NOT_EXIST";
}
interface INVALID_TOKEN_ERROR {
  type: "INVALID_TOKEN_ERROR";
}
interface UNDEFINED_ERROR {
  type: "UNDEFINED_ERROR";
  error: Error;
}
interface QUERY_ERROR {
  type: "QUERY_ERROR";
  errors: t.Errors;
}

type NegativeTeamFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | QUERY_ERROR
  | INCORRECT_TYPE_SAFETY;

const NOT_LOGGED_IN = (): NegativeTeamFetchOutcome => ({
  type: "NOT_LOGGED_IN",
});
const TEAM_DOES_NOT_EXIST = (): NegativeTeamFetchOutcome => ({
  type: "TEAM_DOES_NOT_EXIST",
});
const INVALID_TOKEN_ERROR = (): NegativeTeamFetchOutcome => ({
  type: "INVALID_TOKEN_ERROR",
});
const UNDEFINED_ERROR = (error): NegativeTeamFetchOutcome => ({
  type: "UNDEFINED_ERROR",
  error,
});
const QUERY_ERROR = (errors: t.Errors): NegativeTeamFetchOutcome => ({
  type: "QUERY_ERROR",
  errors,
});

const Team = t.type({
  image: t.type({
    downloadUrl: t.string,
  }),
  name: t.string,
  project: t.type({
    items: t.array(
      t.type({
        name: t.string,
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

const getTeam = (teamName: string) => async (
  session: ISession
): Promise<E.Either<NegativeTeamFetchOutcome, ITeam>> =>
  pipe(
    TE.tryCatch(
      () =>
        new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
          headers: {
            authorization: `Bearer ${session.idToken}`,
          },
        }).request(
          `query($teamName: String!) {
      user {
        team(filter:{
          name: {
            equals: $teamName
          }
        }) {
          items{
            name
            image {
              downloadUrl
            }
            project {
              items {
                name
              }
            }
          }
        }
      }
    }`,
          { teamName }
        ),
      (e) =>
        gqlRequestError.is(e) &&
        e.response.errors.filter((error) => error.code === "InvalidTokenError")
          .length > 0
          ? INVALID_TOKEN_ERROR()
          : UNDEFINED_ERROR(e)
    ),
    TE.chainEitherK(flow(queryTp.decode, E.mapLeft(QUERY_ERROR))),
    TE.chainEitherK(
      flow(
        Lens.fromPath<QueryTp>()(["user", "team", "items"]).get,
        A.head,
        E.fromOption(TEAM_DOES_NOT_EXIST)
      )
    )
  )();

type ITeamProps = { team: ITeam; session: ISession };

const userType = t.type({ id: t.string });

export const getServerSideProps = ({
  params: { teamName },
  req,
}): Promise<{ props: ITeamProps }> =>
  pipe(
    TE.tryCatch(() => auth0().getSession(req), NOT_LOGGED_IN),
    TE.chain(_TE.fromNullable(NOT_LOGGED_IN())),
    TE.chain(
      pipe(
        _RTE.tryToEitherCatch(confirmOrCreateUser("id", userType), UNDEFINED_ERROR),
        _RTE.voidChain(_RTE.tryToEitherCatch(getTeam(teamName), UNDEFINED_ERROR)),
        _RTE.chainEitherKWithAsk((team) => (session) =>
          E.either.of({ props: { session, team } })
        )
      )
    )
  )().then(_E.eitherAsPromise);

export default ({ team, session }: ITeamProps) =>
  pipe(useColorMode(), ({ colorMode }) => (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {team.project.items.map(({ name }, index) => (
          <Link key={name} href={`/${team.name}/${name}`}>
            <a>
              <Card key={index}>
                <Stack spacing={4} isInline>
                  <Image
                    size={10}
                    src={team.image.downloadUrl}
                    bg="gray.50"
                    border="1px solid"
                    borderColor={`mode.${colorMode}.icon`}
                    rounded="sm"
                  />
                  <Stack spacing={2}>
                    <Text color={`mode.${colorMode}.text`} lineHeight="none">
                      {team.name}
                    </Text>
                    <Heading
                      as="h3"
                      lineHeight="none"
                      fontSize="md"
                      fontWeight={900}
                    >
                      {name}
                    </Heading>
                  </Stack>
                </Stack>
              </Card>
            </a>
          </Link>
        ))}
        <ChakraLink
          href={`https://github.com/apps/meeshkan/installations/new?state={"env":"${process.env.GITHUB_AUTH_ENV}","id":"${session.user.sub}"}`}
          bg={`mode.${colorMode}.card`}
          p={4}
          rounded="sm"
          color={`mode.${colorMode}.title`}
          _hover={{ color: `mode.${colorMode}.titleHover` }}
        >
          <Stack spacing={4} align="center" isInline>
            <Icon h={10} w={10} name="add" stroke="2px" />
            <Heading as="h3" lineHeight="none" fontSize="md" fontWeight={900}>
              Authorize a repository
            </Heading>
          </Stack>
        </ChakraLink>
      </Grid>
    </>
  ));
