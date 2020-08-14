import React from "react";
import { Text, Stack, useColorMode } from "@chakra-ui/core";
import Card from "../molecules/card";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";

type SettingsProps = {
  session: ISession;
  repositoryName: String;
  organizationName: String;
  configured: Boolean;
};

const Settings = ({
  session,
  repositoryName,
  organizationName,
  configured,
}: SettingsProps) => {
  const { colorMode } = useColorMode();
  return (
    <Card
      session={session}
      gridArea="1 / 1 / 2 / 2"
      heading="Project details"
      headingLink={`/${organizationName}/${repositoryName}/configuration`}
      linkLabel="This project's configuration page"
      minH="35vh"
    >
      <Stack direction="row" my={2}>
        <Text>Repository:</Text>
        <Text color={`mode.${colorMode}.title`} fontWeight={600}>
          {`${organizationName}/${repositoryName}`}
        </Text>
      </Stack>

      <Stack direction="row" my={2}>
        <Text>Current plan:</Text>
        <Text color={`mode.${colorMode}.title`} fontWeight={600}>
          Free
        </Text>
      </Stack>

      <Stack direction="row" my={2}>
        <Text>Configured:</Text>
        <Text color={`mode.${colorMode}.title`} fontWeight={600}>
          {configured.toString()}
        </Text>
      </Stack>
    </Card>
  );
};

export default Settings;
