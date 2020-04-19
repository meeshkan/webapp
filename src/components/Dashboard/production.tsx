import React from "react";
import { Text, useColorMode } from "@chakra-ui/core";
import Card from "../molecules/card";

const Production = () => {
  const { colorMode } = useColorMode();
  return (
    <Card
      gridArea="1 / 2 / 2 / 3"
      heading="Production tests"
      pageLink="/production"
    >
      <Text mb={8} color={`mode.${colorMode}.text`}>
        yo! sldkfjsldjflasjdflsadlkfjlaskjdf
      </Text>
      <Text mb={8}>yo! sldkfjsldjflasjdflsadlkfjlaskjdf</Text>
      <Text mb={8}>yo! sldkfjsldjflasjdflsadlkfjlaskjdf</Text>
      <Text mb={8}>yo! sldkfjsldjflasjdflsadlkfjlaskjdf</Text>
      <Text mb={8}>yo! sldkfjsldjflasjdflsadlkfjlaskjdf</Text>
    </Card>
  );
};

export default Production;
