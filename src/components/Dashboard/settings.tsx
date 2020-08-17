import React, { useState } from "react";
import { Text, Stack, useColorMode, Button } from "@chakra-ui/core";
import Card from "../molecules/card";
import { IClaims, ISession } from "@auth0/nextjs-auth0/dist/session/session";

type SettingsProps = {
  session: ISession;
  repositoryName: String;
  organizationName: String;
  configured: Boolean;
  repositoryId: Number;
};

const Settings = ({
  session,
  repositoryName,
  organizationName,
  configured,
  repositoryId,
}: SettingsProps) => {
  const [triggerTest, setTriggerTest] = useState(false);
  const [testId, setTestId] = useState(JSON);
  const { colorMode } = useColorMode();

  const today = new Date();

  const handleClick = (repository: Number, requestedBy: IClaims) => {
    let triggerTestData = JSON.stringify({
      repository: repository,
      requested_by: requestedBy,
      time: today.toISOString(),
      premium: true,
      // branch: ""
    });

    fetch("https://meeshkan.io/webhook-prod/trigger-build", {
      method: "POST",
      body: triggerTestData,
      headers: {
        "Api-Key": process.env.MEESHKAN_WEBHOOK_TOKEN,
      },
    }).then((res) => {
      setTriggerTest(true);
      if (res.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + res.status
        );
      }

      res
        .json()
        .then((data) => {
          console.log(data);
          setTestId(data);
        })
        .catch((error) => {
          error.message;
        });
    });
  };
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

      <Button onClick={() => handleClick(repositoryId, session.user)}>
        Trigger premium test
      </Button>
    </Card>
  );
};

export default Settings;
