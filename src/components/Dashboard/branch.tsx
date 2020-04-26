import React from "react";
import Card from "../molecules/card";
import { Test, statusBadge } from "../molecules/test";
// import { GraphQLClient } from "graphql-request";

const branchTests = [
  {
    name: "master@HEAD",
    date: "Mar 12",
    status: statusBadge.inProgress,
  },
  {
    name: "master@9a8d22a",
    date: "Mar 11",
    status: statusBadge.success,
  },
  {
    name: "master@759fb8b",
    date: "Mar 9",
    status: statusBadge.success,
  },
  {
    name: "master@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "master@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "master@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "master@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "master@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "master@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "master@759fb8b",
    date: "Mar 9",
    status: statusBadge.failed,
  },
  {
    name: "master@759fb8b",
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
