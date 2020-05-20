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
} from "@chakra-ui/core";
import ErrorComponent from "../components/molecules/error";
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
import { confirmOrCreateUser } from "../utils/user";
import {
  INCORRECT_TYPE_SAFETY,
  TEAM_DOES_NOT_EXIST,
  INVALID_TOKEN_ERROR,
  UNDEFINED_ERROR,
  NOT_LOGGED_IN,
  defaultGQLErrorHandler,
  GET_SERVER_SIDE_PROPS_ERROR,
} from "../utils/error";
import { retrieveSession } from "./api/session";

type NegativeTeamFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | INCORRECT_TYPE_SAFETY
  | INCORRECT_TYPE_SAFETY;

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
      (error) => defaultGQLErrorHandler("get team query")(error)
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
    TE.chainEitherK(
      flow(
        Lens.fromPath<QueryTp>()(["user", "team", "items"]).get,
        A.head,
        E.fromOption<NegativeTeamFetchOutcome>(() => ({
          type: "TEAM_DOES_NOT_EXIST",
          msg: "The requested team does not exist",
        }))
      )
    )
  )();

type ITeamProps = { team: ITeam; session: ISession };

const userType = t.type({ id: t.string });

export const getServerSideProps = ({
  params: { teamName },
  req,
}): Promise<{ props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, ITeamProps> }> =>
  pipe(
    retrieveSession(req, "[teamName].tsx getServerSideProps"),
    TE.chain(
      pipe(
        _RTE.tryToEitherCatch(
          confirmOrCreateUser("id", userType),
          (error): NegativeTeamFetchOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Unanticipated confirm or create user error in [teamName].tsx",
            error,
          })
        ),
        _RTE.voidChain(
          _RTE.tryToEitherCatch(
            getTeam(teamName),
            (error): NegativeTeamFetchOutcome => ({
              type: "UNDEFINED_ERROR",
              msg: "Unanticipated getTeam error",
              error,
            })
          )
        ),
        _RTE.chainEitherKWithAsk((team) => (session) =>
          E.right({ session, team })
        )
      )
    )
  )().then(_E.eitherSanitizedWithGenericError);

export default (props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, ITeamProps>) =>
pipe(props, E.fold(() => <ErrorComponent errorMessage={"Uh oh. Looks like this resource does not exist. If you suspect it should, reach out to us using the Intercom below."} />, ({ team, session }) =>   pipe(useColorMode(), ({ colorMode }) => (
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
))));
