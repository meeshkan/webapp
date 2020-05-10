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
      headingLink={`/${organizationName}/${repositoryName}/configuration`}
    >
      <Stack isInline my={2}>
        <Text color={`mode.${colorMode}.text`}>Repository:</Text>
        <Text color={`mode.${colorMode}.title`} fontWeight={600}>
          {`${organizationName}/${repositoryName}`}
        </Text>
      </Stack>

      <Stack isInline my={2}>
        <Text color={`mode.${colorMode}.text`}>Current plan:</Text>
        <Text color={`mode.${colorMode}.title`} fontWeight={600}>
          Free
        </Text>
      </Stack>

      <Stack isInline my={2}>
        <Text color={`mode.${colorMode}.text`}>Configuration:</Text>
        <Text color={`mode.${colorMode}.title`} fontWeight={600}>
          Finished
        </Text>
      </Stack>
    </Card>
  );
};

export default Settings;
