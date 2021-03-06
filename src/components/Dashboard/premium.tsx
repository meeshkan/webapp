import React from "react";
import Card from "../molecules/card";
import { Test } from "../molecules/test";
import * as A from "fp-ts/lib/Array";
import { Text } from "@chakra-ui/core";
import * as t from "io-ts";
import { newestDateFirst } from "../../utils/date";
import * as Ord from "fp-ts/lib/Ord";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";

const TTest = t.type({
  status: t.string,
  createdAt: t.string,
  commitHash: t.string,
  id: t.string,
  location: t.string,
});

type ITTest = t.TypeOf<typeof TTest>;

type PremiumProps = {
  session: ISession;
  tests: ITTest[];
  teamName: string;
  projectName: string;
};
export const newestTestFirst: Ord.Ord<ITTest> = {
  compare: (d0, d1) => newestDateFirst.compare(d0.createdAt, d1.createdAt),
  equals: (d0, d1) => newestDateFirst.equals(d0.createdAt, d1.createdAt),
};

const Premium = ({ tests, teamName, projectName, session }: PremiumProps) => {
  return (
    <Card
      session={session}
      gridArea="1 / 2 / 2 / 3"
      heading="Premium tests"
      minH="35vh"
    >
      {!tests.length ? (
        <Text mt={2}>You don't have any premium tests yet.</Text>
      ) : (
        A.sort(newestTestFirst)(tests).map((test, index) => (
          <Test
            key={index}
            branchName={test.location}
            commitHash={test.commitHash}
            date={test.createdAt}
            status={test.status}
            testId={test.id}
            teamName={teamName}
            projectName={projectName}
            premium={true}
          />
        ))
      )}
    </Card>
  );
};

export default Premium;
