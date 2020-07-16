import React from "react";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/core";
import { CheckmarkIcon, XmarkIcon, ArrowRightIcon } from "../../theme/icons";

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
      }}
    >
      <Flex>
        <Box
          borderRadius="full"
          boxSize="32px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mr={2}
          backgroundColor={
            success === true
              ? cyanBackground[colorMode]
              : redBackground[colorMode]
          }
        >
          {success === true ? (
            <CheckmarkIcon color={cyanBorder[colorMode]} />
          ) : (
            <XmarkIcon color={redBorder[colorMode]} />
          )}
        </Box>
        <Flex alignItems="center" py={2}>
          <Text fontWeight={600} color={`mode.${colorMode}.tertiary`}>
            {path}
          </Text>
        </Flex>
      </Flex>

      <ArrowRightIcon color={`mode.${colorMode}.icon`} />
    </Box>
  );
};

export default LogItem;
