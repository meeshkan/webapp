import React from "react";
import Card from "../molecules/card";
import { Test } from "../molecules/test";
import { Text, useColorMode } from "@chakra-ui/core";

type ProductionProps = {
  tests: Array<any>;
};

const Production = ({ tests }: ProductionProps) => {
  const { colorMode } = useColorMode();
  return (
    <Card gridArea="1 / 2 / 2 / 3" heading="Production tests" headingLink="/production">
      { tests.length === 0 ?
        <Text mt={2} color={`mode.${colorMode}.text`}>
          You haven't done any production tests yet.
        </Text>
      :
      tests.map((test, index) => (
        <Test key={index} branchName={test.branchName} date={test.testDate} status={test.testStatus} />
      ))
      }
    </Card>
  );
};

export default Production;