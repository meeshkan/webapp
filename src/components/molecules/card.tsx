import React from "react";
import {
  Box,
  useColorMode,
  Heading,
  Divider,
  Link,
  Icon,
  Stack,
} from "@chakra-ui/core";

type CardProps = {
  children: object;
  gridArea: string;
  heading?: string;
  pageLink?: string;
};

const Card = ({ children, gridArea, heading, pageLink }: CardProps) => {
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
      {pageLink ? (
        <Link
          pos="sticky"
          href={pageLink}
          top={0}
          bg={`mode.${colorMode}.card`}
          color={`mode.${colorMode}.title`}
          _hover={{ color: `mode.${colorMode}.titleHover` }}
        >
          <Stack isInline justify="space-between">
            <Heading
              as="h2"
              fontSize="normal"
              letterSpacing="wide"
              lineHeight="normal"
              fontWeight={800}
              pb={2}
            >
              {heading}
            </Heading>
            <Icon name="arrow-forward" />
          </Stack>
          <Divider borderColor={`mode.${colorMode}.icon`} />
        </Link>
      ) : (
        <Box pos="sticky" top={0} bg={`mode.${colorMode}.card`}>
          {heading ? (
            <Heading
              as="h2"
              color={`mode.${colorMode}.title`}
              fontSize="normal"
              lineHeight="normal"
              letterSpacing="wide"
              fontWeight={800}
              pb={2}
            >
              {heading}
            </Heading>
          ) : null}
          <Divider borderColor={`mode.${colorMode}.icon`} />
        </Box>
      )}

      {children}
    </Box>
  );
};

export default Card;
