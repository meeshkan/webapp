import React from "react";
import Card from "../molecules/card";
import { Test, statusBadge } from "../molecules/test";
// import { GraphQLClient } from "graphql-request";

const branchTests = [
  {
    name: "MEM-400@32sf12b",
    date: "Mar 12",
    status: statusBadge.inProgress,
  },
  {
    name: "MEM-134@9a8d22a",
    date: "Mar 11",
    status: statusBadge.success,
  },
  {
    name: "MEM-213@759fb8b",
    date: "Mar 9",
    status: statusBadge.success,
  },
  {
    name: "MEM-443@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "MEM-123@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "MEM-53@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "MEM-124@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "MEM-214@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "MEM-222@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "MEM-201@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "MEM-33@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
];

const Branch = () => {
  return (
    <Card gridArea="1 / 3 / 3 / 4" heading="Branch tests" headingLink="/branch">
      {branchTests.map((test) => (
        <Test branchName={test.name} date={test.date} status={test.status} />
      ))}
    </Card>
  );
};

export default Branch;
