import React from "react";
import { Text, useColorMode } from "@chakra-ui/core";

const ProductionPage = () => {
  const { colorMode } = useColorMode();
  return (
    <>
      <Text color={`mode.${colorMode}.text`}>production tests</Text>
    </>
  );
};

export default ProductionPage;
