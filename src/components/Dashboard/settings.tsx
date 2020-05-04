import React from "react";
import { Text, Stack, useColorMode, Link as ChakraLink } from "@chakra-ui/core";
import Card from "../molecules/card";
import Link from "next/link";

type SettingsProps = {
  repositoryName: String;
  organizationName: String;
};

const Settings = ({ repositoryName, organizationName }: SettingsProps) => {
  const { colorMode } = useColorMode();
  return (
    <Card
      gridArea="1 / 1 / 2 / 2"
      heading="Project details"
      headingLink="/settings"
    >
      <Stack isInline my={2}>
        <Text color={`mode.${colorMode}.text`}>Repository:</Text>
        <ChakraLink href="/">
          <Text
            color={`mode.${colorMode}.title`}
            cursor="pointer"
            fontWeight={600}
          >
            {`${organizationName}/${repositoryName}`}
          </Text>
        </ChakraLink>
      </Stack>

      <Stack isInline my={2}>
        <Text color={`mode.${colorMode}.text`}>Current plan:</Text>
        <Link href="/sdf">
          <a>
            <Text
              color={`mode.${colorMode}.title`}
              cursor="pointer"
              fontWeight={600}
            >
              Pro
            </Text>
          </a>
        </Link>
      </Stack>

      <Stack isInline my={2}>
        <Text color={`mode.${colorMode}.text`}>Configuration:</Text>
        <Link href="/settings">
          <a>
            <Text
              color={`mode.${colorMode}.title`}
              cursor="pointer"
              fontWeight={600}
            >
              Strict
            </Text>
          </a>
        </Link>
      </Stack>
    </Card>
  );
};

export default Settings;
