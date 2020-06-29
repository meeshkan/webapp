import { Badge, Box, Stack, Text, useColorMode, Icon } from "@chakra-ui/core";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

type TestProps = {
  branchName: string;
  date: string;
  status: string;
  commitHash: string;
  testId: string;
  teamName: string;
  projectName: string;
  premium: boolean;
};

export const Test = ({
  commitHash,
  branchName,
  date,
  status,
  testId,
  teamName,
  projectName,
  premium,
}: TestProps) => {
  const { colorMode } = useColorMode();
  return (
    <Link
      href={`/${teamName}/${projectName}/${testId}`}
      aria-label={`An individual test for ${teamName}'s project, ${projectName}`}
    >
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
                : status === "Passing"
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
          {premium && (
            <Badge
              fontWeight={600}
              rounded="sm"
              padding="0px 4px"
              minH="auto"
              mb={3}
              textTransform="none"
              variantColor="yellow"
            >
              <Icon mr={2} name="star" size="10px" />
              Premium
            </Badge>
          )}
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
