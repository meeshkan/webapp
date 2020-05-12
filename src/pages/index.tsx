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
import Card from "../components/molecules/card";
import { useFetchUser } from "../utils/user";
import * as t from "io-ts";
import { GraphQLClient } from "graphql-request";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import auth0 from "../utils/auth0";
import { confirmOrCreateUser } from "../utils/user";

enum NegativeProjectsFetchOutcome {
  NOT_LOGGED_IN,
  INVALID_TOKEN_ERROR,
  UNDEFINED_ERROR,
  QUERY_ERROR, // the query we made does not conform to the type we expect
}

const Team = t.type({
  image: t.union([t.null, t.type({
    downloadUrl: t.string,
  })]),
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

const getProjects = async (
  session: ISession
): Promise<Either<NegativeProjectsFetchOutcome, ITeam[]>> => {
  const _8baseGraphQLClient = new GraphQLClient(
    process.env.EIGHT_BASE_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${session.idToken}`,
      },
    }
  );

  const query = `query {
    user {
      team {
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
    const result = await _8baseGraphQLClient.request(query);
    const teams = result.user.team ? result.user.team.items : [];

    console.log(teams);
    return t.array(Team).is(teams)
      ? right(teams)
      : left(NegativeProjectsFetchOutcome.QUERY_ERROR);
  } catch (e) {
    if (
      e.response.errors.filter((error) => error.code === "InvalidTokenError")
        .length > 0
    ) {
      console.log(e);
      return left(NegativeProjectsFetchOutcome.INVALID_TOKEN_ERROR);
    }
    console.log(e);
    return left(NegativeProjectsFetchOutcome.UNDEFINED_ERROR);
  }
};

type IProjectsProps = Either<NegativeProjectsFetchOutcome, ITeam[]>;

export async function getServerSideProps(
  context
): Promise<{ props: IProjectsProps }> {
  const {
    req
  } = context;
  const session = await auth0.getSession(req);
  if (!session) {
    return { props: left(NegativeProjectsFetchOutcome.NOT_LOGGED_IN) };
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
  const teams = await getProjects(session);

  return {
    props: teams,
  };
}

interface IProject {
  teamName: string;
  teamImage: string;
  projectName: string;
}
const teamsToProjects = (teams: ITeam[]): IProject[] =>
  teams.flatMap(({ name, image, project: { items } }) =>
    items.map( item => ({
      teamName: name,
      teamImage: image ? image.downloadUrl : "https://picsum.photos/200",
      projectName: item.name,
    }))
  );

export default function Home(projectsProps: IProjectsProps) {
  const { colorMode } = useColorMode();
  return (isLeft(projectsProps) ? <div>bad</div> :
    <>
      {" "}
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {teamsToProjects(projectsProps.right).map(({ teamName, teamImage, projectName }, index) => (
          <Card key={index} link={`/${teamName}/${projectName}`}>
            <Stack spacing={4} isInline>
              <Image
                size={10}
                src={teamImage}
                bg="gray.50"
                border="1px solid"
                borderColor={`mode.${colorMode}.icon`}
                rounded="sm"
              />
              <Stack spacing={2}>
                <Text color={`mode.${colorMode}.text`} lineHeight="none">
                  {teamName}
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
