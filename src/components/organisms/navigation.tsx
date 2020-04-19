import React from "react";
import { Icon, Flex, useColorMode, IconButton, Stack } from "@chakra-ui/core";
import Project from "../molecules/project";

const Navigation = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Flex
        p={4}
        align="center"
        justify="space-between"
        backgroundColor={`mode.${colorMode}.card`}
        rounded="sm"
        mb={8}
        pos="sticky"
        top={4}
      >
        <a href="/">
          <Icon name="Logo" color={`mode.${colorMode}.title`} h={8} w="auto" />
        </a>
        <Project />
      </Flex>
    </>
  );
};

export default Navigation;
