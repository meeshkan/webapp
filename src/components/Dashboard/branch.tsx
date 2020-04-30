import React from "react";
import Card from "../molecules/card";
import { Test } from "../molecules/test";
import { Text, useColorMode } from "@chakra-ui/core";

type BranchProps = {
  tests: Array<any>;
};

const Branch = ({ tests }: BranchProps) => {
  const { colorMode } = useColorMode();
  return (
    <Card gridArea="1 / 3 / 3 / 4" heading="Branch tests" headingLink="/branch">
      { !tests.length ?
        <Text mt={2} color={`mode.${colorMode}.text`}>
          You haven't done any branch tests yet.
        </Text>
      :
      tests.map((test, index) => (
        <Test key={index} branchName={test.branchName} date={test.testDate} status={test.testStatus} />
      ))
      }
    </Card>
  );
};

export default Branch;
