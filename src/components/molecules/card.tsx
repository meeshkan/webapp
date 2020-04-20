import React from "react";
import {
  Box,
  useColorMode,
  Heading,
  Divider,
  Icon,
  Stack,
  Link,
} from "@chakra-ui/core";
import { useRouter } from "next/router";

type CardProps = {
  children: object;
  gridArea?: string;
  heading?: string;
  pageLink?: string;
};

const Card = ({ children, gridArea, heading, pageLink }: CardProps) => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push(pageLink);
  };
  return (
    <Box
      bg={`mode.${colorMode}.card`}
      p={4}
      maxH="80vh"
      rounded="sm"
      gridArea={gridArea}
      overflow="scroll"
    >
      {pageLink ? (
        <Link
          href={pageLink}
          onClick={handleClick}
          color={`mode.${colorMode}.title`}
          _hover={{ color: `mode.${colorMode}.titleHover` }}
        >
          <Stack
            isInline
            justify="space-between"
            borderBottom="1px solid"
            borderColor={`mode.${colorMode}.icon`}
          >
            <Heading
              as="h2"
              fontSize="normal"
              letterSpacing="wide"
              lineHeight="normal"
              fontWeight={800}
              mb={2}
            >
              {heading}
            </Heading>
            <Icon name="arrow-forward" />
          </Stack>
        </Link>
      ) : (
        <Box>
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
