import React from "react";
import Card from "../molecules/card";
import { Test } from "../molecules/test";
import { Text, useColorMode } from "@chakra-ui/core";
import * as t from "io-ts";
//import { DateFromString } from "../../utils/customTypes";

const TTest = t.type({
  status: t.string,
  createdAt: t.string, //DateFromString
  commitHash: t.string,
  id: t.string,
});

type ITTest = t.TypeOf<typeof TTest>;

type BranchProps = {
  tests: ITTest[];
  projectName: string;
  teamName: string;
};

const Branch = ({ tests, teamName, projectName }: BranchProps) => {
  const { colorMode } = useColorMode();
  return (
    <Card gridArea="1 / 3 / 3 / 4" heading="Branch tests">
      {!tests.length ? (
        <Text mt={2} color={`mode.${colorMode}.text`}>
          You haven't done any branch tests yet.
        </Text>
      ) : (
        tests.map((test, index) => (
          <Test
            key={index}
            branchName={"branch"}
            commitHash={test.commitHash}
            date={test.createdAt}
            status={test.status}
            teamName={teamName}
            testId={test.id}
            projectName={projectName}
          />
        ))
      )}
    </Card>
  );
};

export default Branch;
