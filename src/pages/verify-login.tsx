import React from "react";
import {
  Stack,
  Heading,
  Text,
  Button,
  Icon,
  useColorMode,
} from "@chakra-ui/core";

const VerifyLoginPage = () => {
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
        rounded="sm"
        fontWeight={900}
        px={4}
        mt={10}
        variantColor="red"
        onClick={() => {
          /*verifyLoginFunction()*/
        }}
      >
        <Icon name="github" mr={2} />
        Import from GitHub
      </Button>
    </Stack>
  );
};

export default VerifyLoginPage;
