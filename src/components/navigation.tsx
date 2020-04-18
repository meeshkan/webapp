import React from "react";
import { Icon, Flex, useColorMode, IconButton } from "@chakra-ui/core";

const Navigation = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Flex
        py={4}
        px={[4, 4, 4, 8]}
        align="center"
        justify="space-between"
        backgroundColor={`mode.${colorMode}.card`}
        rounded="sm"
        mb={6}
        pos="sticky"
        top={4}
      >
        <a href="/">
          <Icon name="Logo" color={`mode.${colorMode}.title`} h={10} w="auto" />
        </a>
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
      </Flex>
    </>
  );
};

export default Navigation;
