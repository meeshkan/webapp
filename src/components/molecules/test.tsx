import React from "react";
import { Stack, Text, Badge, Box, useColorMode } from "@chakra-ui/core";
import dayjs from "dayjs";

type TestProps = {
  branchName: string;
  date: string;
  status: string;
  commitHash: string;
};

export const Test = ({ commitHash, branchName, date, status }: TestProps) => {
  const { colorMode } = useColorMode();
  return (
    <Box my={3} borderBottom="1px solid" borderColor={`mode.${colorMode}.icon`}>
      <Stack isInline>
        <Text
          fontWeight={600}
          lineHeight="normal"
          color={`mode.${colorMode}.title`}
        >
          {`${branchName}@${commitHash}`}
        </Text>
        <Badge
          variantColor={
            status === "In progress"
              ? "yellow"
              : status === "Success"
              ? "cyan"
              : status === "Failed"
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
        {dayjs(date).format("MMM D hh:mma")}
      </Text>
    </Box>
  );
};
