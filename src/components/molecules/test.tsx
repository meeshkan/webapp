import { Badge, Box, Stack, Text, useColorMode } from "@chakra-ui/core";
import { StarIcon } from "../../theme/icons";
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
        <Stack direction="row">
          <Text fontWeight={600} color={`mode.${colorMode}.title`}>
            {`${branchName}@${commitHash.slice(0, 7)}`}
          </Text>
          <Badge
            colorScheme={
              status === "In progress"
                ? "yellow"
                : status === "Passing"
                ? "cyan"
                : status === "Failed"
                ? "red"
                : null
            }
            fontWeight={600}
            borderRadius="sm"
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
              borderRadius="sm"
              padding="0px 4px"
              minH="auto"
              mb={3}
              textTransform="none"
              colorScheme="yellow"
            >
              <StarIcon mr={2} boxSize="10px" />
              Premium
            </Badge>
          )}
        </Stack>

        <Text fontSize="sm" lineHeight="normal" mb={4}>
          {dayjs(date).format("MMM D hh:mma")}
        </Text>
      </Box>
    </Link>
  );
};
