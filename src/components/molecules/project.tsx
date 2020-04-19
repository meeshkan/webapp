import React from "react";
import { Flex, Text, Icon, useColorMode } from "@chakra-ui/core";

const ProjectSettings = () => {
  const { colorMode } = useColorMode();
  return (
    <Flex backgroundColor={`mode.${colorMode}.background`} rounded="sm">
      {/* <img src="" /> */}
      <Text>Web app</Text>
      <Icon name="chevron-down" />
    </Flex>
  );
};

export default ProjectSettings;
