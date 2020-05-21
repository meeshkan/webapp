import React from "react";
import { Box, Icon, Flex, Text, Heading, useColorMode } from "@chakra-ui/core";

type LogProps = {
  method: string;
  path: string;
  success: boolean;
};

const LogItem = ({ method, path, success }: LogProps) => {
  const { colorMode } = useColorMode();
  const cyanBackground = { light: "cyan.50", dark: "cyan.900" };
  const cyanBorder = { light: "cyan.500", dark: "cyan.300" };
  const redBackground = { light: "red.50", dark: "red.900" };
  const redBorder = { light: "red.500", dark: "red.300" };
  return (
    <Box>
      <Icon
        name={success === true ? "check" : "close"}
        borderColor={
          success === true ? cyanBorder[colorMode] : redBorder[colorMode]
        }
        background={
          success === true
            ? cyanBackground[colorMode]
            : redBackground[colorMode]
        }
      />
      <Flex>
        <Heading>{method}</Heading>
        <Text>{path}</Text>
      </Flex>
    </Box>
  );
};

export default LogItem;
