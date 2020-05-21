import React from "react";
import { Box, Icon, Flex, Text, useColorMode } from "@chakra-ui/core";

type LogProps = {
  method: string;
  path: string;
  success: boolean;
};

const LogItem = ({ method, path, success }: LogProps) => {
  const { colorMode } = useColorMode();
  const cyanBackground = { light: "cyan.50", dark: "cyan.900" };
  const cyanBorder = { light: "cyan.700", dark: "cyan.200" };
  const redBackground = { light: "red.50", dark: "red.900" };
  const redBorder = { light: "red.700", dark: "red.200" };
  return (
    <Box
      d="flex"
      alignItems="center"
      my={3}
      borderBottom="1px solid"
      borderColor={`mode.${colorMode}.icon`}
    >
      <Box
        rounded="full"
        size="32px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={4}
        mr={2}
        backgroundColor={
          success === true
            ? cyanBackground[colorMode]
            : redBackground[colorMode]
        }
      >
        <Icon
          name={success === true ? "checkmark" : "xmark"}
          color={
            success === true ? cyanBorder[colorMode] : redBorder[colorMode]
          }
        />
      </Box>
      <Flex alignItems="center" mb={4}>
        <Text
          fontWeight={600}
          lineHeight="normal"
          color={`mode.${colorMode}.text`}
          mr={1}
        >
          {method}
        </Text>
        <Text color={`mode.${colorMode}.tertiary`}>{path}</Text>
      </Flex>
    </Box>
  );
};

export default LogItem;
