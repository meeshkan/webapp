import React from "react";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { Box, useColorMode, Heading, Stack, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { mixpanelize } from "../../utils/mixpanel-client";

type CardProps = {
  children: object;
  session?: ISession;
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
  session,
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
    mixpanelize(
      session,
      `Navigated to ${link || headingLink}`,
      {
        to: link,
        c2a: linkLabel,
      },
      () => {}
    );
    router.push(headingLink || link);
  };
  return (
    <>
      {link ? (
        <NextLink href={link}>
          <Link
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
        </NextLink>
      ) : (
        <Box
          id={id}
          bg={`mode.${colorMode}.card`}
          p={4}
          maxH="80vh"
          minH={minH && minH}
          borderRadius="sm"
          gridArea={gridArea}
          position="relative"
          overflow="auto"
        >
          {headingLink ? (
            <NextLink href={headingLink}>
              <Link
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
            </NextLink>
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
