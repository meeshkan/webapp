import React from "react";
import Card from "../molecules/card";
import { Test } from "../molecules/test";
//import { DateFromString } from "../../utils/customTypes";
import { Text, useColorMode } from "@chakra-ui/core";
import * as t from "io-ts";

const TTest = t.type({
  status: t.string,
  createdAt: t.string, //DateFromString
  commitHash: t.string,
});

type ITTest = t.TypeOf<typeof TTest>;

type ProductionProps = {
  tests: ITTest[];
};

const Production = ({ tests }: ProductionProps) => {
  const { colorMode } = useColorMode();
  return (
    <Card gridArea="1 / 2 / 2 / 3" heading="Production tests">
      {!tests.length ? (
        <Text mt={2} color={`mode.${colorMode}.text`}>
          You haven't done any production tests yet.
        </Text>
      ) : (
        tests.map((test, index) => (
          <Test
            key={index}
            branchName={"master"}
            commitHash={test.commitHash}
            date={test.createdAt}
            status={test.status}
          />
        ))
      )}
    </Card>
  );
};

export default Production;
