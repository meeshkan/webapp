import React from "react";
import { Box, useColorMode, Heading, Stack, Link } from "@chakra-ui/core";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

type CardProps = {
  children: object;
  gridArea?: string;
  heading?: string;
  headingLink?: string;
  link?: string;
  linkLabel?: string;
  id?: string;
  minH?: string;
};

const Card = ({
  children,
  gridArea,
  heading,
  headingLink,
  link,
  linkLabel,
  id,
  minH,
}: CardProps) => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push(headingLink || link);
  };
  return (
    <>
      {link ? (
        <Link
          href={link}
          onClick={handleClick}
          color={`mode.${colorMode}.title`}
          _hover={{ color: `mode.${colorMode}.titleHover` }}
          aria-label={linkLabel}
        >
          <Box
            id={id}
            bg={`mode.${colorMode}.card`}
            p={4}
            maxH="80vh"
            minH={minH && minH}
            borderRadius="sm"
            gridArea={gridArea}
            overflow="auto"
          >
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
                  borderBottom="1px solid"
                  borderColor={`mode.${colorMode}.icon`}
                >
                  {heading}
                </Heading>
              ) : null}
            </Box>
            {children}
          </Box>
        </Link>
      ) : (
        <Box
          id={id}
          bg={`mode.${colorMode}.card`}
          p={4}
          maxH="80vh"
          minH={minH && minH}
          borderRadius="sm"
          gridArea={gridArea}
          overflow="auto"
        >
          {headingLink ? (
            <Link
              href={headingLink}
              aria-label={linkLabel}
              onClick={handleClick}
              color={`mode.${colorMode}.title`}
              _hover={{ color: `mode.${colorMode}.titleHover` }}
            >
              <a>
                <Stack
                  direction="row"
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
                  <ArrowForwardIcon />
                </Stack>
              </a>
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
                  borderBottom="1px solid"
                  borderColor={`mode.${colorMode}.icon`}
                >
                  {heading}
                </Heading>
              ) : null}
            </Box>
          )}

          {children}
        </Box>
      )}
    </>
  );
};

export default Card;
