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
import auth0 from "../../utils/auth0";
import Card from "../../components/molecules/card";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { confirmOrCreateUser } from "../../utils/user";
import * as t from "io-ts";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";

enum NegativeTeamFetchOutcome {
  NOT_LOGGED_IN,
  TEAM_DOES_NOT_EXIST,
  INVALID_TOKEN_ERROR,
  UNDEFINED_ERROR,
  QUERY_ERROR, // the query we made does not conform to the type we expect
}

const Team = t.type({
  image: t.type({
    downloadUrl: t.string,
  }),
  project: t.type({
    items: t.array(
      t.type({
        name: t.string,
      })
    ),
  }),
});

type ITeam = t.TypeOf<typeof Team>;

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
    const result = await _8baseGraphQLClient.request(query, { teamName });
    if (!result.user.team || result.user.team.items.length === 0) {
      return left(NegativeTeamFetchOutcome.TEAM_DOES_NOT_EXIST);
    }
    const team = result.user.team.items[0];

    return Team.is(team)
      ? right(team)
      : left(NegativeTeamFetchOutcome.QUERY_ERROR);
  } catch (e) {
    if (
      e.response.errors.filter((error) => error.code === "InvalidTokenError")
        .length > 0
    ) {
      return left(NegativeTeamFetchOutcome.INVALID_TOKEN_ERROR);
    }
    return left(NegativeTeamFetchOutcome.UNDEFINED_ERROR);
  }
};

type ITeamProps = Either<
  NegativeTeamFetchOutcome,
  {
    teamName: string;
    team: ITeam;
  }
>;

export async function getServerSideProps(
  context
): Promise<{ props: ITeamProps }> {
  const {
    params: { teamName },
    req,
  } = context;
  const session = await auth0.getSession(req);
  if (!session) {
    return { props: left(NegativeTeamFetchOutcome.NOT_LOGGED_IN) };
  }
  const tp = t.type({ id: t.string });
  const c = await confirmOrCreateUser<t.TypeOf<typeof tp>>(
    "id",
    session,
    tp.is
  );
  if (isLeft(c)) {
    console.error("type safety error in application");
  }
  const team = await getTeam(session, teamName);

  return {
    props: isLeft(team)
      ? left(team.left)
      : right({ teamName, team: team.right }),
  };
}

export default function OrganizationPage(teamProps: ITeamProps) {
  const { colorMode } = useColorMode();
  return isLeft(teamProps) ? (
    <div>Sorry, you can't be here.</div>
  ) : (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {teamProps.right.team.project.items.map(({ name }, index) => (
          <Link key={name} href={`/${teamProps.right.teamName}/${name}`}>
            <a>
              <Card key={index}>
                <Stack spacing={4} isInline>
                  <Image
                    size={10}
                    src={teamProps.right.team.image.downloadUrl}
                    bg="gray.50"
                    border="1px solid"
                    borderColor={`mode.${colorMode}.icon`}
                    rounded="sm"
                  />
                  <Stack spacing={2}>
                    <Text color={`mode.${colorMode}.text`} lineHeight="none">
                      {teamProps.right.teamName}
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
          href="https://github.com/apps/meeshkan/installations/new"
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
