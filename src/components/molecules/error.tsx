import React from "react";
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorMode,
  Flex,
  Link,
} from "@chakra-ui/core";
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
      rounded="sm"
      pt={96}
    >
      <Alert
        variant="subtle"
        status="error"
        flexDirection="column"
        backgroundColor={colorMode === "light" ? "red.50" : "red.900"}
        rounded="sm"
        maxW="750px"
        mx="auto"
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
          overflow="scroll"
        >
          {errorMessage}
        </AlertDescription>
      </Alert>
      <Flex justify="center" mt={8}>
        <NextLink href="/">
          <Link
            color={`mode.${colorMode}.link`}
            fontWeight={900}
            _hover={{ textDecor: "none" }}
          >
            {`Go back home ->`}
          </Link>
        </NextLink>
      </Flex>
    </Box>
  );
};

export default ErrorComponent;
