import React from "react";
import { Text, useColorMode } from "@chakra-ui/core";

const SettingsPage = () => {
  const { colorMode } = useColorMode();
  return (
    <>
      <Text color={`mode.${colorMode}.text`}>settings here</Text>
    </>
  );
};

export default SettingsPage;
