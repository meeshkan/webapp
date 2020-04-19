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
        <Stack isInline>
          <Project />
          <IconButton
            aria-label={`Switch to ${
              colorMode === "light" ? "dark" : "light"
            } mode`}
            variant="ghost"
            color={`mode.${colorMode}.title`}
            ml="2"
            fontSize="20px"
            onClick={toggleColorMode}
            icon={colorMode === "light" ? "moon" : "sun"}
            transition="all 0.2s"
          />
        </Stack>
      </Flex>
    </>
  );
};

export default Navigation;
