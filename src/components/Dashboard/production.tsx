import React from "react";
import Card from "../molecules/card";
import { Test, statusBadge } from "../molecules/test";

const Production = () => {
  return (
    <Card
      gridArea="1 / 2 / 2 / 3"
      heading="Production tests"
      headingLink="/production"
    >
      <Test
        branchName="master@HEAD"
        date="Mar 12"
        status={statusBadge.inProgress}
      />
      <Test
        branchName="master@9a8d22a"
        date="Mar 11"
        status={statusBadge.failed}
      />
      <Test
        branchName="master@759fb8b"
        date="Mar 9"
        status={statusBadge.success}
      />
      <Test
        branchName="master@759fb8b"
        date="Mar 9"
        status={statusBadge.failed}
      />
    </Card>
  );
};

export default Production;
