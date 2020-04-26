import React from "react";
import {
  Stack,
  Text,
  Grid,
  Image,
  useColorMode,
  Heading,
  Icon,
  Link,
} from "@chakra-ui/core";
import Card from "../components/molecules/card";
import { repos } from "../data/repoQuery";

export default function Home() {
  const { colorMode } = useColorMode();
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {repos.map((repo, index) => (
          <Card
            link={`/${repo.organization.toLowerCase()}-${repo.repository.toLowerCase()}/dashboard`}
            key={index}
          >
            <Stack spacing={4} isInline>
              <Image size={10} src={repo.image} rounded="sm" />
              <Stack spacing={2}>
                <Text color={`mode.${colorMode}.text`} lineHeight="none">
                  {repo.organization.toLowerCase()}
                </Text>
                <Heading
                  as="h3"
                  lineHeight="none"
                  fontSize="md"
                  fontWeight={900}
                >
                  {repo.repository.toLowerCase()}
                </Heading>
              </Stack>
            </Stack>
          </Card>
        ))}

        <Link
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
        </Link>
      </Grid>
    </>
  );
}
