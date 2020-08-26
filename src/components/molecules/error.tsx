import React from "react";
import { Box, useColorMode, Flex, Link } from "@chakra-ui/core";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/alert";
import * as E from "fp-ts/lib/Either";
import NextLink from "next/link";

type ErrorProps = {
  errorMessage: Object;
};

const ErrorComponent = ({ errorMessage }: ErrorProps) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      h="82.5vh"
      w="100%"
      backgroundColor={`mode.${colorMode}.card`}
      borderRadius="sm"
      pt={96}
    >
      <Alert
        variant="subtle"
        status="error"
        flexDirection="column"
        backgroundColor={colorMode === "light" ? "red.50" : "red.900"}
        borderRadius="sm"
        maxW="750px"
        mx="auto"
        __css={{}}
      >
        <Flex mb={8}>
          <AlertIcon color={colorMode === "light" ? "red.500" : "red.200"} />
          <AlertTitle
            fontWeight={900}
            color={colorMode === "light" ? "red.500" : "red.200"}
          >
            Ooops! An error has occured
          </AlertTitle>
        </Flex>
        <AlertDescription
          color={colorMode === "light" ? "red.900" : "red.50"}
          fontFamily="mono"
          fontWeight={900}
          maxH="400px"
          overflow="auto"
        >
          {errorMessage}
        </AlertDescription>
      </Alert>
      <Flex justify="center" mt={8}>
        <NextLink href="/">
          <Link
            aria-label="Error page linking back to the safety of the home page"
            fontWeight={900}
            _hover={{ textDecor: "none" }}
          >
            Go to dashboard
          </Link>
        </NextLink>
      </Flex>
    </Box>
  );
};

export const withError = <E, A>(m: string, f: (a: A) => JSX.Element) =>
  E.fold<E, A, JSX.Element>(() => <ErrorComponent errorMessage={m} />, f);

export default ErrorComponent;
