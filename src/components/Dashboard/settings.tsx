import React from "react";
import { Text } from "@chakra-ui/core";
import Card from "../molecules/card";

const Settings = () => {
  return (
    <Card
      gridArea="1 / 1 / 2 / 2"
      heading="Project details"
      pageLink="/settings"
    >
      <Text>Placholder</Text>
    </Card>
  );
};

export default Settings;
