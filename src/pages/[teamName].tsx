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
import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import Link from "next/link";
import React from "react";
import Card from "../components/molecules/card";
import ErrorComponent from "../components/molecules/error";
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
} from "../utils/error";
import { eightBaseClient } from "../utils/graphql";
import { confirmOrCreateUser } from "../utils/user";
import { withSession } from "./api/session";

type NegativeTeamFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
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

type ITeamProps = { team: ITeam; session: ISession };

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
    RTE.chain((team) => (session) => TE.right({ session, team })),
    withSession(req, "[teamName].tsx getServerSideProps")
  )().then(_E.eitherSanitizedWithGenericError);

export default (props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, ITeamProps>) =>
  pipe(
    props,
    E.fold(
      () => (
        <ErrorComponent
          errorMessage={
            "Uh oh. Looks like this resource does not exist. If you suspect it should, reach out to us using the Intercom below."
          }
        />
      ),
      ({ team, session }) =>
        pipe(useColorMode(), ({ colorMode }) => (
          <>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {team.project.items.map(({ name }, index) => (
                <Link
                  key={name}
                  href={`/${team.name}/${name}`}
                  aria-label={`Links to ${team.name}'s project ${name}`}
                >
                  <a>
                    <Card key={index}>
                      <Stack spacing={4} isInline>
                        <Image
                          size={10}
                          src={
                            team.image
                              ? team.image.downloadUrl
                              : "https://picsum.photos/200"
                          }
                          alt={`${team.name}'s organization image`}
                          bg="gray.50"
                          border="1px solid"
                          borderColor={`mode.${colorMode}.icon`}
                          rounded="sm"
                        />
                        <Stack spacing={2}>
                          <Text
                            color={`mode.${colorMode}.text`}
                            lineHeight="none"
                          >
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
                    Authorize a repository
                  </Heading>
                </Stack>
              </ChakraLink>
            </Grid>
          </>
        ))
    )
  );
