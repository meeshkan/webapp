import React from "react";
import {
  Stack,
  Heading,
  Text,
  Button,
  Icon,
  useColorMode,
} from "@chakra-ui/core";

export default ({ link }: { link: string }) => {
  const { colorMode } = useColorMode();
  return (
    <Stack mt={12} justify="center" align="center">
      <Heading
        as="h1"
        size="xl"
        fontWeight={900}
        color={`mode.${colorMode}.title`}
      >
        Verify your GitHub login
      </Heading>
      <Text
        maxW="750px"
        textAlign="center"
        mt={4}
        lineHeight="base"
        fontWeight={500}
        color={`mode.${colorMode}.text`}
      >
        Periodically, we ask users to sign into github again as an added
        security measure. You will be able to use the Meeshkan web app again
        after this step.
      </Text>
      <Button
        as="a"
        // @ts-ignore
        href={link}
        aria-label="Sign in to GitHub to verify your credentials"
        rounded="sm"
        fontWeight={900}
        px={4}
        mt={10}
        variantColor="red"
      >
        <Icon name="github" mr={2} />
        Sign in to GitHub
      </Button>
    </Stack>
  );
};
