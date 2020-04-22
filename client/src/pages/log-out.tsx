import React from "react";
import { Text, useColorMode } from "@chakra-ui/core";

const LogOutPage = () => {
  const { colorMode } = useColorMode();
  return <Text color={`mode.${colorMode}.text`}>yo</Text>;
};

export default LogOutPage;
