import React from "react";
import {
  Box,
  useColorMode,
  Text,
  Flex,
  Code,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Link,
} from "@chakra-ui/core";
import { CheckmarkIcon, XmarkIcon } from "../../theme/icons";

import CodeBlock from "../molecules/codeBlock";
import { CommandType } from "../../utils/testLog";
import ReactMarkdown from "react-markdown";
import Renderers from "./markdownComponents";
import prettier from "prettier/standalone";
import parserGraphql from "prettier/parser-graphql";

type ExchangeProps = {
  command: CommandType;
  commands: boolean;
};

const ExchangeMessage = ({ command, commands }: ExchangeProps) => {
  const { colorMode } = useColorMode();
  const red = { light: "red.500", dark: "red.300" };
  const yellow = { light: "yellow.500", dark: "yellow.300" };
  const cyan = { light: "cyan.500", dark: "cyan.300" };
  const cyanBorder = { light: "cyan.700", dark: "cyan.200" };
  const redBorder = { light: "red.700", dark: "red.200" };

  return (
    <>
      <Box mb={8}>
        <Heading
          mb={4}
          color={`mode.${colorMode}.title`}
          fontWeight={900}
          fontSize="xl"
        >
          <Flex align="center">
            {command.success ? (
              <CheckmarkIcon
                boxSize="16px"
                mr={2}
                color={cyanBorder[colorMode]}
              />
            ) : (
              <XmarkIcon boxSize="16px" mr={2} color={redBorder[colorMode]} />
            )}
            {command.success ? "Test case passed" : "Test case failed"}
            {command.priority && (
              <Popover>
                <PopoverTrigger>
                  <Text
                    cursor="pointer"
                    color={
                      command.priority >= 4
                        ? cyan[colorMode]
                        : command.priority >= 3
                        ? yellow[colorMode]
                        : command.priority >= 0
                        ? red[colorMode]
                        : "gray.500"
                    }
                    fontWeight={900}
                    ml={4}
                  >
                    Priority level {command.priority}
                  </Text>
                </PopoverTrigger>
                <PopoverContent borderRadius="sm">
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader fontSize="md">Prioritization</PopoverHeader>
                  <PopoverBody fontWeight={400} fontSize="md" lineHeight="tall">
                    Higher priority / more urgent bugs are lower value (1-3)
                    and, and lower priority / less urgent bugs (4-5). More
                    information about our classification{" "}
                    <Link
                      href="https://meeshkan.com/docs/prioritizing-bugs/"
                      // color={`mode.${colorMode}.link`}
                      isExternal
                    >
                      can be found in the docs.
                    </Link>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
          </Flex>
        </Heading>

        {command.test_case && (
          <Flex mb={2}>
            <Text color={`mode.${colorMode}.title`} mr={2}>
              Test case:
            </Text>
            <Text color={`mode.${colorMode}.text`} fontStyle="italic">
              {command.test_case}
            </Text>
          </Flex>
        )}

        {command.exchange.length > 1 && (
          <Text color={`mode.${colorMode}.text`} mb={2}>
            {command.exchange.length > 1
              ? `Number of steps in this stateful test: ${command.exchange.length}`
              : `Test results:`}
          </Text>
        )}

        {command.error_message && (
          <Text mb={2} mr={2}>
            {command.error_message}
          </Text>
        )}

        {command.comment && (
          <ReactMarkdown
            source={command.comment}
            // @ts-expect-error
            renderers={Renderers}
          />
        )}
      </Box>

      {commands && (
        <Heading
          as="h2"
          fontSize="lg"
          mt={8}
          mb={4}
          fontWeight={900}
          color={`mode.${colorMode}.title`}
        >
          Stateful steps in this test and their results:
        </Heading>
      )}

      <Accordion defaultIndex={[0]} allowMultiple __css={{}}>
        {command.exchange.map((exchange, index) => (
          <AccordionItem
            key={index}
            border="none"
            mb={8}
            borderRadius="sm"
            color={`mode.${colorMode}.text`}
            backgroundColor={`mode.${colorMode}.card`}
            __css={{}}
          >
            <Box
              key={index}
              border="none"
              mb={8}
              borderRadius="sm"
              color={`mode.${colorMode}.text`}
              backgroundColor={`mode.${colorMode}.card`}
            >
              <AccordionButton
                color={`mode.${colorMode}.title`}
                _hover={{
                  backgroundColor: "none",
                }}
                _focus={{
                  outline: "none",
                  borderBottom: "1px solid",
                  borderBottomColor: `mode.${colorMode}.icon`,
                }}
                _active={{
                  borderBottom: "1px solid",
                  borderBottomColor: `mode.${colorMode}.icon`,
                }}
                borderRadius="sm"
                p={4}
                justifyContent="space-between"
                __css={{}}
              >
                <Flex>
                  <Text fontWeight={600} mr={2}>
                    {exchange.meta.apiType === "graphql"
                      ? JSON.parse(exchange.request.body)["query"].startsWith(
                          "query"
                        )
                        ? "QUERY"
                        : JSON.parse(exchange.request.body)["query"].startsWith(
                            "mutation"
                          )
                        ? "MUTATION"
                        : JSON.parse(exchange.request.body)["query"].startsWith(
                            "subscription"
                          )
                        ? "SUBSCRIPTION"
                        : exchange.request.method.toUpperCase()
                      : exchange.request.method.toUpperCase()}
                  </Text>
                  <Text fontWeight={600}>{exchange.meta.path}</Text>
                </Flex>
                <AccordionIcon color={`mode.${colorMode}.icon`} />
              </AccordionButton>
              <AccordionPanel py={4} __css={{}}>
                <Flex>
                  {exchange.response.statusCode && (
                    <Code
                      fontWeight={700}
                      mb={2}
                      fontSize="md"
                      colorScheme="gray"
                    >
                      HTTP status code: {exchange.response.statusCode}
                    </Code>
                  )}
                </Flex>
                {exchange.request.body && (
                  <>
                    <Heading
                      as="h4"
                      fontSize="lg"
                      my={4}
                      fontWeight={900}
                      color={`mode.${colorMode}.title`}
                    >
                      Request body:
                    </Heading>
                    <CodeBlock
                      className={
                        exchange.meta.apiType === "rest"
                          ? "json"
                          : exchange.meta.apiType === "graphql"
                          ? "graphql"
                          : "json"
                      }
                    >
                      {exchange.meta.apiType === "rest"
                        ? JSON.stringify(
                            JSON.parse(exchange.request.body),
                            null,
                            2
                          )
                        : exchange.meta.apiType === "graphql"
                        ? (() => {
                            try {
                              return prettier.format(
                                JSON.parse(exchange.request.body)["query"],
                                {
                                  parser: "graphql",
                                  plugins: [parserGraphql],
                                }
                              );
                            } catch {
                              return JSON.parse(exchange.request.body)["query"];
                            }
                          })()
                        : JSON.stringify(
                            JSON.parse(exchange.request.body),
                            null,
                            2
                          )}
                    </CodeBlock>
                  </>
                )}
                {exchange.response.body && (
                  <>
                    <Heading
                      as="h4"
                      fontSize="lg"
                      my={4}
                      fontWeight={900}
                      color={`mode.${colorMode}.title`}
                    >
                      Response body:
                    </Heading>
                    <CodeBlock className={"json"}>
                      {JSON.stringify(
                        JSON.parse(exchange.response.body),
                        null,
                        2
                      )}
                    </CodeBlock>
                  </>
                )}
              </AccordionPanel>
            </Box>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default ExchangeMessage;
