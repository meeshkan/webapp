import React from "react";
import Card from "../molecules/card";
import { Test } from "../molecules/test";
import { Text } from "@chakra-ui/core";
import * as t from "io-ts";
import { newestDateFirst } from "../../utils/date";
import * as A from "fp-ts/lib/Array";
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

type BranchProps = {
  session: ISession;
  tests: ITTest[];
  projectName: string;
  teamName: string;
};

export const newestTestFirst: Ord.Ord<ITTest> = {
  compare: (d0, d1) => newestDateFirst.compare(d0.createdAt, d1.createdAt),
  equals: (d0, d1) => newestDateFirst.equals(d0.createdAt, d1.createdAt),
};

const Branch = ({ tests, teamName, projectName, session }: BranchProps) => {
  return (
    <Card session={session} gridArea="1 / 3 / 3 / 4" heading="Continuous tests">
      {!tests.length ? (
        <Text mt={2}>
          You haven't made a commit to the project since importing, meaning
          there are no continuous tests yet.
        </Text>
      ) : (
        A.sort(newestTestFirst)(tests).map((test, index) => (
          <Test
            key={index}
            branchName={test.location}
            commitHash={test.commitHash}
            date={test.createdAt}
            status={test.status}
            teamName={teamName}
            testId={test.id}
            projectName={projectName}
            premium={false}
          />
        ))
      )}
    </Card>
  );
};

export default Branch;
