import React from "react";
import {
  Heading,
  Box,
  Button,
  useColorMode,
  Grid,
  Skeleton,
} from "@chakra-ui/core";
import { useFetchUser } from "../utils/user";
import { useRouter } from "next/router";

// cards
import Settings from "../components/Dashboard/settings";
import Production from "../components/Dashboard/production";
import Branch from "../components/Dashboard/branch";
import Chart from "../components/Dashboard/chart";

export default function Home() {
  const { colorMode } = useColorMode();
  const { user, loading } = useFetchUser();
  const router = useRouter();

  return (
    <>
      {!user && (
        <Box as="section" my={12}>
          <Heading
            as="h2"
            color={`mode.${colorMode}.title`}
            textAlign="center"
            mb={4}
          >
            Sign in to start using Meeshkan
          </Heading>
          <Button
            d="flex"
            my={4}
            mx="auto"
            rounded="sm"
            fontWeight="900"
            variantColor="red"
            onClick={() => router.push("/api/login")}
          >
            Sign in / Sign up
          </Button>
        </Box>
      )}
      {user && (
        <Grid
          templateColumns="repeat(3, 1fr)"
          templateRows="repeat(2, 1fr)"
          gap={8}
          // pos="fixed"
          // bottom={8}
          // right={8}
          // left={8}
          // top={128}
        >
          <Settings loading={!loading} />
          <Production />
          <Branch />
          <Chart />
        </Grid>
      )}
    </>
  );
}
