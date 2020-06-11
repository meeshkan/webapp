import React from "react";
import Card from "../molecules/card";
import { Test } from "../molecules/test";
import * as A from "fp-ts/lib/Array";
import { Text, useColorMode } from "@chakra-ui/core";
import * as t from "io-ts";
import { newestDateFirst } from "../../utils/date";
import * as Ord from "fp-ts/lib/Ord";

const TTest = t.type({
  status: t.string,
  createdAt: t.string,
  commitHash: t.string,
  id: t.string,
});

type ITTest = t.TypeOf<typeof TTest>;

type ProductionProps = {
  tests: ITTest[];
  teamName: string;
  projectName: string;
};
export const newestTestFirst: Ord.Ord<ITTest> = {
  compare: (d0, d1) => newestDateFirst.compare(d0.createdAt, d1.createdAt),
  equals: (d0, d1) => newestDateFirst.equals(d0.createdAt, d1.createdAt),
};

const Production = ({ tests, teamName, projectName }: ProductionProps) => {
  const { colorMode } = useColorMode();
  return (
    <Card gridArea="1 / 2 / 2 / 3" heading="Production tests" minH="35vh">
      {!tests.length ? (
        <Text mt={2} color={`mode.${colorMode}.text`}>
          You haven't done any production tests yet.
        </Text>
      ) : (
        A.sort(newestTestFirst)(tests).map((test, index) => (
          <Test
            key={index}
            branchName={"master"}
            commitHash={test.commitHash}
            date={test.createdAt}
            status={test.status}
            testId={test.id}
            teamName={teamName}
            projectName={projectName}
          />
        ))
      )}
    </Card>
  );
};

export default Production;
