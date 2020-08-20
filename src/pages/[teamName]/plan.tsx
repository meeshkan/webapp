import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import {
  Button,
  SimpleGrid,
  Heading,
  Stack,
  Flex,
  FormControl,
  Text,
  Code,
  useColorMode,
  Box,
} from "@chakra-ui/core";
import auth0 from "../../utils/auth0";
import getStripe from "../../utils/getStripe";
import Card from "../../components/molecules/card";
import { CheckmarkIcon, XmarkIcon } from "../../theme/icons";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { useRouter } from "next/router";
import { getTeam } from "../[teamName]";
/////////////
import * as t from "io-ts";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import { flow, constant, constNull, constVoid } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import * as Ord from "fp-ts/lib/Ord";
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as _E from "../../fp-ts/Either";
import * as _RTE from "../../fp-ts/ReaderTaskEither";
import { NonEmptyArray, groupSort } from "fp-ts/lib/NonEmptyArray";
import { LensTaskEither, lensTaskEitherHead } from "../../monocle-ts";
import { ITeamsProps } from "..";
import { GET_SERVER_SIDE_PROPS_ERROR } from "../../utils/error";
import {
  stripe,
  createCustomerId,
  getPlan,
  titleToPlan,
} from "../../utils/stripe";
import { confirmOrCreateUser } from "../../utils/user";
import { withSession } from "../api/session";
import { UPDATE_STRIPE_ID_MUTATION } from "../../gql/pages/[teamName]/plan";
import { ITeamWithStripe } from "../[teamName]";
import { eightBaseClient } from "../../utils/graphql";
import { withError } from "../../components/molecules/error";

/////////////

type IPlanProps = {
  team: ITeamWithStripe;
  plan: string;
  id: string;
  session: ISession;
};

const userType = t.type({ id: t.string });

export const getServerSideProps = ({
  params: { teamName },
  req,
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, IPlanProps>;
}> =>
  pipe(
    _RTE.seq2([confirmOrCreateUser("id", userType), getTeam(teamName)]),
    RTE.chain(([{ id }, team]) => (session) =>
      team.stripeCustomerId !== null
        ? TE.right({ session, id, team })
        : pipe(
            createCustomerId(id, team.name)(session),
            TE.chain((customerId) =>
              TE.right({
                id,
                team: {
                  ...team,
                  stripeCustomerId: customerId,
                },
              })
            )
          )
    ),
    RTE.chain(({ id, team }) => (session) =>
      TE.tryCatch(
        () =>
          stripe()
            .customers.retrieve(team.stripeCustomerId)
            .then((res) => ({
              session,
              plan: getPlan(res),
              id,
              team,
            })),
        () => ({
          type: "STRIPE_ERROR",
          msg: "Could not create a stripe customer",
        })
      )
    ),
    withSession(req, "plan.tsx getServerSideProps")
  )().then(_E.eitherSanitizedWithGenericError);
//////////////////////////////////////

type PricingProps = {
  title: string;
  subtitle: string;
  currentPlan: string;
  price: string;
  session: ISession;
  yesFeatures?: Array<string>;
  noFeatures?: Array<string>;
  hasCTA: boolean;
  handleSubmit: any;
  loading: boolean;
};

const PricingCard = ({
  title,
  subtitle,
  price,
  yesFeatures,
  currentPlan,
  noFeatures,
  hasCTA,
  handleSubmit,
  session,
  loading,
}: PricingProps) => {
  const { colorMode } = useColorMode();
  return (
    <Card session={session}>
      <Heading
        as="h3"
        fontSize="2xl"
        fontWeight={900}
        mb={4}
        textAlign="center"
        color={`mode.${colorMode}.title`}
      >
        {title}
        <Code colorScheme="blue" fontSize="md" ml={3}>
          {subtitle}
        </Code>
      </Heading>
      <Text textAlign="center" fontSize="xl" fontWeight={500}>
        {price}
      </Text>

      <Stack spacing={2} mt={4}>
        {yesFeatures &&
          yesFeatures.map((feature, index) => (
            <Flex key={index} align="center">
              <CheckmarkIcon color="cyan.500" mr={3} />
              <Text>{feature}</Text>
            </Flex>
          ))}

        {noFeatures &&
          noFeatures.map((feature, index) => (
            <Flex key={index} align="center">
              <XmarkIcon color="red.500" mr={3} />
              <Text>{feature}</Text>
            </Flex>
          ))}
      </Stack>

      <Box h="72px" />

      {hasCTA && (
        <Flex
          align="center"
          justify="space-between"
          mt={4}
          mx="auto"
          pos="absolute"
          bottom={4}
          right={4}
          left={4}
        >
          <FormControl as="form" onSubmit={handleSubmit}>
            <Button
              isDisabled={loading || titleToPlan[title] === currentPlan}
              type="submit"
              colorScheme="red"
              w="full"
              mt={8}
            >
              Purchase {title} plan
            </Button>
          </FormControl>
        </Flex>
      )}
    </Card>
  );
};

const Checkout = withError<GET_SERVER_SIDE_PROPS_ERROR, IPlanProps>(
  "Uh oh. It looks like this resource does not exist!",
  (props: IPlanProps) => {
    const [loading, setLoading] = useState(false);
    const session = props.session;
    const toTypeform: React.FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();
    };
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
      setLoading(true);
      fetch(
        `/api/stripe-portal?customer=${props.team.stripeCustomerId}&return_url=${process.env.LOGOUT_REDIRECT_URL}${props.team.name}`
      )
        .then((res) => res.json())
        .then((data) => {
          window.location.href = data.url;
          return Promise.resolve(true);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    return (
      <SimpleGrid columns={3} spacing={8} maxW="1000px" mx="auto">
        <PricingCard
          session={session}
          title="Free"
          subtitle="for Individuals"
          price="$0"
          currentPlan={props.plan}
          yesFeatures={[
            "1 team member",
            "2 projects",
            "Manual project setup",
            "100 testing hours",
            "GitHub import",
          ]}
          noFeatures={[
            "Concurrent tests",
            "GitLab & Bitbucket",
            "Test history",
            "Audit reports",
          ]}
          hasCTA={true}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <PricingCard
          session={session}
          title="Pro"
          subtitle="for Teams"
          currentPlan={props.plan}
          price="$99"
          yesFeatures={[
            "8 team members",
            "Unlimited projects",
            "1 project set up",
            "1000 testing hours",
            "3 concurrent tests",
            "Weekly audit reporting",
            "30 day history",
          ]}
          noFeatures={[
            "GitLab & Bitbucket",
            "Jira/Linear integration",
            "Auth flow testing UI",
            "Custom build pipelines",
          ]}
          hasCTA={true}
          handleSubmit={handleSubmit}
          loading={loading}
        />
        <PricingCard
          session={session}
          title="Business"
          subtitle="starting at"
          price="$2000"
          yesFeatures={[
            "25 team members",
            "Unlimited projects",
            "5 projects set up",
            "Unlimited testing hours",
            "10 concurrent tests",
            "Unlimited history",
            "GitLab & Bitbucket import",
            "Auth flow testing UI",
            "Custom build pipelines",
            "Role based permissions",
            "Jira/Linear integration",
          ]}
          currentPlan={props.plan}
          hasCTA={true}
          handleSubmit={toTypeform}
          loading={loading}
        />
      </SimpleGrid>
    );
  }
);

export default Checkout;
