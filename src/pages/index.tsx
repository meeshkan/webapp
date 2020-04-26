import React from "react";
import {
  Stack,
  Text,
  Grid,
  Image,
  useColorMode,
  Heading,
} from "@chakra-ui/core";
import Card from "../components/molecules/card";

const repos = [
  {
    image: "https://via.placeholder.com/40",
    organization: "meeshkan",
    repository: "webapp",
  },
  {
    image: "https://via.placeholder.com/40",
    organization: "willacompany",
    repository: "mono",
  },
  {
    image: "https://via.placeholder.com/40",
    organization: "eggheadio",
    repository: "illustrated-dev",
  },
  {
    image: "https://via.placeholder.com/40",
    organization: "chakra-ui",
    repository: "chakra-ui",
  },
  {
    image: "https://via.placeholder.com/40",
    organization: "KenzoBenzo",
    repository: "personal-portfolio",
  },
];

export default function Home() {
  const { colorMode } = useColorMode();
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {repos.map((repo, index) => (
          <Card
            link={`${repo.organization.toLowerCase()}-${repo.repository.toLowerCase()}/dashboard`}
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
                  color={`mode.${colorMode}.title`}
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
      </Grid>
    </>
  );
}
