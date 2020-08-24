import React from "react";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/core";
import { CheckmarkIcon, XmarkIcon, ArrowRightIcon } from "../../theme/icons";

type LogProps = {
  i: number;
  path: string;
  success: boolean;
  priority: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const LogItem = ({ i, path, success, priority, setIndex }: LogProps) => {
  const { colorMode } = useColorMode();
  const stoplight = {
    light: {
      success: { stroke: "cyan.500", background: "cyan.50" },
      failure: { stroke: "red.500", background: "red.50" },
      text: { cyan: "cyan.500", yellow: "yellow.500", red: "red.500" },
    },
    dark: {
      success: { stroke: "cyan.100", background: "rgba(51, 204, 174, 0.25)" },
      failure: { stroke: "red.100", background: "rgba(220, 24, 83, 0.25)" },
      text: { cyan: "cyan.200", yellow: "yellow.200", red: "red.200" },
    },
  };
  return (
    <Box
      d="flex"
      alignItems="center"
      justifyContent="space-between"
      onClick={() => {
        setIndex(i);
      }}
      borderBottom="1px solid"
      borderColor={`mode.${colorMode}.icon`}
      px={2}
      py={1}
      borderRadius="md"
      transition="all 0.3s"
      _hover={{
        background: `mode.${colorMode}.background`,
        cursor: "pointer",
        borderBottomColor: "transparent",
      }}
    >
      <Flex alignItems="center" py={2}>
        <Box
          borderRadius="full"
          boxSize="32px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mr={2}
          backgroundColor={
            success === true
              ? stoplight[colorMode].success.background
              : stoplight[colorMode].failure.background
          }
        >
          {success === true ? (
            <CheckmarkIcon color={stoplight[colorMode].success.stroke} />
          ) : (
            <XmarkIcon color={stoplight[colorMode].failure.stroke} />
          )}
        </Box>
        <Text fontWeight={600} color={`mode.${colorMode}.tertiary`}>
          {path}
        </Text>
        <Text
          color={
            priority >= 4
              ? stoplight[colorMode].text.cyan
              : priority >= 3
              ? stoplight[colorMode].text.yellow
              : priority >= 0
              ? stoplight[colorMode].text.red
              : "gray.500"
          }
          fontWeight={900}
          ml={4}
        >
          {priority ? `P` + priority : null}
        </Text>
      </Flex>

      <ArrowRightIcon color={`mode.${colorMode}.icon`} />
    </Box>
  );
};

export default LogItem;
