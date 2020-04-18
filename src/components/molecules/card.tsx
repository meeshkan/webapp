import React from "react";
import { Box, useColorMode, Heading, Divider } from "@chakra-ui/core";

type CardProps = {
  children: object;
  gridArea: string;
  heading?: string;
};

const Card = ({ children, gridArea, heading }: CardProps) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      bg={`mode.${colorMode}.card`}
      p={4}
      rounded="sm"
      h="100%"
      gridArea={gridArea}
      overflow="scroll"
    >
      {heading ? (
        <Box pos="sticky" top={0} bg={`mode.${colorMode}.card`}>
          <Heading as="h2" color={`mode.${colorMode}.title`}>
            {heading}
          </Heading>
          <Divider />
        </Box>
      ) : null}

      {children}
    </Box>
  );
};

export default Card;
