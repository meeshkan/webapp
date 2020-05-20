import React from "react";
import { Stack, Text, Badge, Box, useColorMode } from "@chakra-ui/core";
import dayjs from "dayjs";
import Link from "next/link";

type TestProps = {
  branchName: string;
  date: string;
  status: string;
  commitHash: string;
  testId: string;
  teamName: string;
  projectName: string;
};

export const Test = ({
  commitHash,
  branchName,
  date,
  status,
  testId,
  teamName,
  projectName,
}: TestProps) => {
  const { colorMode } = useColorMode();
  return (
    <Link href={`/${teamName}/${projectName}/${testId}`}>
      <Box
        my={3}
        borderBottom="1px solid"
        borderColor={`mode.${colorMode}.icon`}
        cursor="pointer"
      >
        <Stack isInline>
          <Text
            fontWeight={600}
            lineHeight="normal"
            color={`mode.${colorMode}.title`}
          >
            {`${branchName}@${commitHash.slice(0, 7)}`}
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
    </Link>
  );
};
