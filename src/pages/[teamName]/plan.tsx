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

type PricingProps = {
  title: string;
  subtitle: string;
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
              isDisabled={loading || title === "Free"}
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

const Checkout = (props) => {
  const [loading, setLoading] = useState(false);
  const session = props.session;
  const toTypeform: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    window.location.href = "https://meeshkan.typeform.com/to/oYCF6vWQ";
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      sessionId: props.sessionId,
    });
    console.warn(error.message);
    setLoading(false);
  };

  return (
    <SimpleGrid columns={3} spacing={8} maxW="1000px" mx="auto">
      <PricingCard
        session={session}
        title="Free"
        subtitle="for Individuals"
        price="$0"
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
        hasCTA={true}
        handleSubmit={toTypeform}
        loading={loading}
      />
    </SimpleGrid>
  );
};

Checkout.getInitialProps = async function ({ req }) {
  const res = await fetch(
    `${process.env.LOGOUT_REDIRECT_URL}api/build-checkout`
  );
  const data = await res.json();
  const session = await auth0().getSession(req);
  return {
    sessionId: data.id,
    session,
  };
};

export default Checkout;
