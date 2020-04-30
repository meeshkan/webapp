import React from "react";
import Card from "../molecules/card";
import { Test } from "../molecules/test";

type ProductionProps = {
  tests: Array<any>;
};

const Production = ({ tests }: ProductionProps) => {
  return (
    <Card gridArea="1 / 2 / 2 / 3" heading="Production tests" headingLink="/production">
      {tests.map((test, index) => (
        <Test key={index} branchName={test.branchName} date={test.testDate} status={test.testStatus} />
      ))}
    </Card>
  );
};

export default Production;