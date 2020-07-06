import React from "react";
import {
  Box,
  Heading,
  Flex,
  LightMode,
  Button,
  Text,
  useColorMode,
  Link,
} from "@chakra-ui/core";
import { useRouter } from "next/router";

const SignIn = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  return (
    <Box
      as="section"
      mt={24}
      mx="auto"
      p={8}
      backgroundColor={`mode.${colorMode}.card`}
      maxW="750px"
      borderRadius="sm"
    >
      <Heading
        as="h2"
        color={`mode.${colorMode}.title`}
        textAlign="center"
        mb={6}
      >
        Sign in to start using Meeshkan
      </Heading>
      <Text
        textAlign="center"
        mb={16}
        lineHeight="tall"
        fontSize="xl"
        fontStyle="italic"
        fontWeight={500}
        color={`mode.${colorMode}.text`}
      >
        Meeshkan is currently in alpha and by invitation only.
        <br />
        <Link
          color={colorMode === "light" ? "blue.500" : "blue.300"}
          href="https://meeshkan.com/"
          isExternal
        >
          Request alpha access
        </Link>{" "}
        if you're interested.
      </Text>
      <Flex justify="center">
        <LightMode>
          <Button colorScheme="red" onClick={() => router.push("/api/login")}>
            Sign in
          </Button>
        </LightMode>
      </Flex>
    </Box>
  );
};

export default SignIn;
