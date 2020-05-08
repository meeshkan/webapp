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

export default function Home() {
  const { colorMode } = useColorMode();
  const { user } = useFetchUser();
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {user.projects.map(({ owner: { login, avatarUrl }, name }, index) => (
          <Card key={index} link={`/${login}/${name}`}>
            <Stack spacing={4} isInline>
              <Image
                size={10}
                src={avatarUrl}
                bg="gray.50"
                border="1px solid"
                borderColor={`mode.${colorMode}.icon`}
                rounded="sm"
              />
              <Stack spacing={2}>
                <Text color={`mode.${colorMode}.text`} lineHeight="none">
                  {login}
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
        <a href={`https://slack.com/oauth/v2/authorize?client_id=258714091073.1105258957971&scope=incoming-webhook&state=${user.node_id}&redirect_uri=${process.env.SLACK_OAUTH_REDIRECT_URI}`}><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" /></a>
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
