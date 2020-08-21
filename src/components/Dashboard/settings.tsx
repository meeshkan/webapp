import React, { useState } from "react";
import { Text, Stack, useColorMode, Button, useToast } from "@chakra-ui/core";
import Card from "../molecules/card";
import { IClaims, ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { useRouter } from "next/router";

type SettingsProps = {
  session: ISession;
  repositoryName: String;
  teamName: String;
  configured: Boolean;
  repositoryId: Number;
};

const Settings = ({
  session,
  repositoryName,
  teamName,
  configured,
  repositoryId,
}: SettingsProps) => {
  const [triggerTest, setTriggerTest] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const router = useRouter();

  const today = new Date();

  const handleClick = (repository: Number, requestedBy: IClaims) => {
    setTriggerTest(true);
    let triggerTestData = JSON.stringify({
      repository: repository,
      requested_by: requestedBy,
      time: today.toISOString(),
      premium: true,
      // branch: ""
    });

    fetch("/api/trigger-build", {
      method: "POST",
      body: triggerTestData,
      headers: {
        "Api-Key": process.env.MEESHKAN_WEBHOOK_TOKEN,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + res.status
        );
      }

      res
        .json()
        .then((data) => {
          router.push(`/${teamName}/${repositoryName}/${data.test}`);
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
      headingLink={`/${teamName}/${repositoryName}/configuration`}
      linkLabel="This project's configuration page"
      minH="35vh"
    >
      <Stack direction="row" my={2}>
        <Text>Repository:</Text>
        <Text color={`mode.${colorMode}.title`} fontWeight={600}>
          {`${teamName}/${repositoryName}`}
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

      <Button
        onClick={() => {
          handleClick(repositoryId, session.user);
          toast({
            title: "Premium test triggered",
            description:
              "A premium test has been triggered on the default branch of this repository. Premium tests can take up to 24 hours.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }}
        colorScheme="gray"
        size="sm"
        mt={4}
        disabled={triggerTest}
      >
        {triggerTest ? `Premium test triggered` : `Trigger premium test`}
      </Button>
    </Card>
  );
};

export default Settings;
