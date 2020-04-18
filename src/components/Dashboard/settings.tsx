import React from "react";
import { Box, Heading, useColorMode, Divider } from "@chakra-ui/core";
import Card from "../molecules/card";

const Settings = () => {
  const { colorMode } = useColorMode();
  return (
    <Card gridArea="1 / 1 / 2 / 2">
      <Heading as="h2" color={`mode.${colorMode}.title`}>
        Project details
      </Heading>
      <Divider />
    </Card>
  );
};

export default Settings;
