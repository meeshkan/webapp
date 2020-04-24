import React from "react";
import { useColorMode, Text, Skeleton } from "@chakra-ui/core";
import { useFetchUser } from "../utils/user";

export default function Home() {
  const { colorMode } = useColorMode();
  const { user, loading } = useFetchUser();

  return (
    <>
      {user && (
        <Skeleton isLoaded={!loading}>
          <Text color={`mode.${colorMode}.text`}>
            Lets put the project picker here
          </Text>
        </Skeleton>
      )}
    </>
  );
}
