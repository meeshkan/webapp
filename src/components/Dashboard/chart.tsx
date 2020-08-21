import React from "react";
import { Text } from "@chakra-ui/core";
import Card from "../molecules/card";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";

const Chart = ({ session }: { session: ISession }) => {
  return (
    <Card session={session} gridArea="2 / 1 / 3 / 3" heading="Bugs" minH="35vh">
      <Text mt={2}>Burn-down chart of bugs, coming soon...</Text>
    </Card>
  );
};

export default Chart;
