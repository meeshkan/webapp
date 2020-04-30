import React from "react";
import Card from "../molecules/card";
import { Test } from "../molecules/test";

const Branch = ({ tests }) => {
  console.log('Branch tests', tests)
  return (
    <Card gridArea="1 / 3 / 3 / 4" heading="Branch tests" headingLink="/branch">
      {tests.map((test, index) => (
        <Test key={index} id={test.id} branchName={test.branchName} date={test.testDate} status={test.testStatus} />
      ))}
    </Card>
  );
};

export default Branch;
