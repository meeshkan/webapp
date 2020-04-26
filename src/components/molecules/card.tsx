import React from "react";
import { Box, useColorMode, Heading, Icon, Stack, Link } from "@chakra-ui/core";
import { useRouter } from "next/router";

type CardProps = {
  children: object;
  gridArea?: string;
  heading?: string;
  headingLink?: string;
  link?: string;
};

const Card = ({
  children,
  gridArea,
  heading,
  headingLink,
  link,
}: CardProps) => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push(headingLink);
  };
  return (
    <>
      {link ? (
        <Link href={link} onClick={handleClick}>
          <Box
            bg={`mode.${colorMode}.card`}
            p={4}
            maxH="80vh"
            rounded="sm"
            gridArea={gridArea}
            overflow="scroll"
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
          bg={`mode.${colorMode}.card`}
          p={4}
          maxH="80vh"
          rounded="sm"
          gridArea={gridArea}
          overflow="scroll"
        >
          {headingLink ? (
            <Link
              href={headingLink}
              onClick={handleClick}
              color={`mode.${colorMode}.title`}
              _hover={{ color: `mode.${colorMode}.titleHover` }}
            >
              <a>
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
