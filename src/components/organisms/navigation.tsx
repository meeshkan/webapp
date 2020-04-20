import React from "react";
import { Icon, Flex, useColorMode } from "@chakra-ui/core";
import Project from "../molecules/project";
import Link from "next/link";

const Navigation = () => {
  const { colorMode } = useColorMode();
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
        <Link href="/">
          <Icon name="Logo" color={`mode.${colorMode}.title`} h={8} w="auto" />
        </Link>
        <Project />
      </Flex>
    </>
  );
};

export default Navigation;
