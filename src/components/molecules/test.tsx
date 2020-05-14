import React from "react";
import { Stack, Text, Badge, Box, useColorMode } from "@chakra-ui/core";

type TestProps = {
  branchName: string;
  date: Date;
  status: string;
};

export const Test = ({ branchName, date, status }: TestProps) => {
  const { colorMode } = useColorMode();
  return (
    <Box my={3} borderBottom="1px solid" borderColor={`mode.${colorMode}.icon`}>
      <Stack isInline>
        <Text
          fontWeight={600}
          lineHeight="normal"
          color={`mode.${colorMode}.title`}
        >
          {branchName}
        </Text>
        <Badge
          variantColor={
            status === "inProgress"
              ? "yellow"
              : status === "success"
              ? "cyan"
              : status === "failed"
              ? "red"
              : null
          }
          fontWeight={600}
          rounded="sm"
          padding="0px 4px"
          minH="auto"
          mb={3}
          textTransform="none"
        >
          {status}
        </Badge>
      </Stack>

      <Text
        color={`mode.${colorMode}.text`}
        fontSize="sm"
        lineHeight="normal"
        mb={4}
      >
        {date.toString()}
      </Text>
    </Box>
  );
};
