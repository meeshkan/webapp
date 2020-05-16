import React from "react";
import Link from "next/link";
import {
  Stack,
  Text,
  Grid,
  Image,
  useColorMode,
  Heading,
  Icon,
  Link as ChakraLink,
} from "@chakra-ui/core";
import { GraphQLClient } from "graphql-request";
import auth0 from "../utils/auth0";
import Card from "../components/molecules/card";
import { Either, left, right, isLeft, chain } from "fp-ts/lib/Either";
import { confirmOrCreateUser } from "../utils/user";
import * as t from "io-ts";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { head } from "fp-ts/lib/Array";
import { fold as oFold } from "fp-ts/lib/Option";
import { fold as eFold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { Eq } from "fp-ts/lib/Eq";

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
}
interface QUERY_ERROR {
  type: "QUERY_ERROR";
}

type NegativeTeamFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | QUERY_ERROR;

const eqNegativeTeamFetchOutcome: Eq<NegativeTeamFetchOutcome> = {
  equals: (x: NegativeTeamFetchOutcome, y: NegativeTeamFetchOutcome) => x.type === y.type
}

const NOT_LOGGED_IN = (): NegativeTeamFetchOutcome => ({
  type: "NOT_LOGGED_IN",
});
const TEAM_DOES_NOT_EXIST = (): NegativeTeamFetchOutcome => ({
  type: "TEAM_DOES_NOT_EXIST",
});
const INVALID_TOKEN_ERROR = (): NegativeTeamFetchOutcome => ({
  type: "INVALID_TOKEN_ERROR",
});
const UNDEFINED_ERROR = (): NegativeTeamFetchOutcome => ({
  type: "UNDEFINED_ERROR",
});
const QUERY_ERROR = (): NegativeTeamFetchOutcome => ({ type: "QUERY_ERROR" });

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

const getTeam = async (
  session: ISession,
  teamName: string
): Promise<Either<NegativeTeamFetchOutcome, ITeam>> => {
  const _8baseGraphQLClient = new GraphQLClient(
    process.env.EIGHT_BASE_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${session.idToken}`,
      },
    }
  );

  const query = `query($teamName: String!) {
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
  }`;

  try {
    return pipe(
      queryTp.decode(await _8baseGraphQLClient.request(query, { teamName })),
      eFold(
        () => left(QUERY_ERROR()),
        (query: QueryTp) =>
          pipe(
            head(query.user.team.items),
            oFold(
              () => left(TEAM_DOES_NOT_EXIST()),
              (a: ITeam) => right(a)
            )
          )
      )
    );
  } catch (e) {
    if (
      e.response &&
      e.response.errors &&
      e.response.errors.filter((error) => error.code === "InvalidTokenError")
        .length > 0
    ) {
      return left(INVALID_TOKEN_ERROR());
    }
    console.error("Undefined 8base error", e.response.errors);
    return left(UNDEFINED_ERROR());
  }
};

type ITeamProps = { team: ITeam; session: ISession };

export async function getServerSideProps(
  context
): Promise<{ props: Either<NegativeTeamFetchOutcome, ITeamProps> }> {
  const {
    params: { teamName },
    req,
  } = context;
  const session = await auth0().getSession(req);
  if (!session) {
    return { props: left(NOT_LOGGED_IN()) };
  }
  const createdUser = await confirmOrCreateUser(
    "id",
    session,
    t.type({ id: t.string })
  );

  if (isLeft(createdUser)) {
    console.error("type safety error in application");
  }
  const trans = team => right<NegativeTeamFetchOutcome, ITeamProps>({session, team });
  return {
    props: chain(trans)(await getTeam(session, teamName))
  }
}

export default function OrganizationPage(teamProps: Either<NegativeTeamFetchOutcome, ITeamProps>) {
  if (isLeft(teamProps)) {
    //useRouter().push("/404");
    return <></>;
  }
  const { colorMode } = useColorMode();
  const team = teamProps.right.team;
  return (
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
          href={`https://github.com/apps/meeshkan/installations/new?state={"env":"${process.env.GITHUB_AUTH_ENV}","id":"${teamProps.right.session.user.sub}"}`}
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
  );
}
