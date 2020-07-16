import React from "react";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/core";
import { CheckkmarkIcon, XmarkIcon } from "../../theme/icons";

type LogProps = {
  i: number;
  path: string;
  success: boolean;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const LogItem = ({ i, path, success, setIndex }: LogProps) => {
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
      onClick={() => {
        setIndex(i);
      }}
      borderBottom="1px solid"
      borderColor={`mode.${colorMode}.icon`}
    >
      <Box
        borderRadius="full"
        boxSize="32px"
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
        {success === true ? (
          <CheckkmarkIcon color={cyanBorder[colorMode]} />
        ) : (
          <XmarkIcon color={redBorder[colorMode]} />
        )}
      </Box>
      <Flex alignItems="center" mb={4}>
        <Text color={`mode.${colorMode}.tertiary`}>{path}</Text>
      </Flex>
    </Box>
  );
};

export default LogItem;
