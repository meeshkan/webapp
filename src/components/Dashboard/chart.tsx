import React from "react";
import { Text, useColorMode } from "@chakra-ui/core";
import Card from "../molecules/card";

const Chart = () => {
  const { colorMode } = useColorMode();
  return (
    <Card gridArea="2 / 1 / 3 / 3" heading="Bugs">
      <Text mt={2} color={`mode.${colorMode}.text`}>
        Burn-down chart of bugs, coming soon...
      </Text>
    </Card>
  );
};

export default Chart;
