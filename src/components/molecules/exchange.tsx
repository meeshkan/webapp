import React from "react";
import { Box, useColorMode, Text, Flex, Code, Heading } from "@chakra-ui/core";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/accordion";
import CodeBlock from "../molecules/codeBlock";
import { ExchangeType, CommandType } from "../../utils/testLog";
import ReactMarkdown from "react-markdown";
import Renderers from "./markdownComponents";
import prettier from "prettier/standalone";
import parserGraphql from "prettier/parser-graphql";

type ExchangeProps = {
  command: CommandType;
};

const ExchangeMessage = ({ command }: ExchangeProps) => {
  const { colorMode } = useColorMode();
  const red = { light: "red.500", dark: "red.300" };
  const yellow = { light: "yellow.500", dark: "yellow.300" };
  const cyan = { light: "cyan.500", dark: "cyan.300" };
  return (
    <Box>
      <Box
        border="none"
        mb={8}
        borderRadius="sm"
        color={`mode.${colorMode}.text`}
        backgroundColor={`mode.${colorMode}.card`}
      >
        <Box>
          <Box flex="1" textAlign="left">
            <Flex>
              {command.error_message && (
                <Text mb={2} mr={2}>
                  {command.error_message}
                </Text>
              )}

              {command.priority && (
                <Text
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
              )}
            </Flex>
            <Flex>
              {command.comment && (
                <ReactMarkdown
                  source={command.comment}
                  // @ts-expect-error
                  renderers={Renderers}
                />
              )}
            </Flex>
          </Box>
          <AccordionIcon />
        </Box>
        {command.exchange.map((exchange) => {
          <Box py={4}>
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
            <Flex>
              {exchange.response.statusCode && (
                <Code fontWeight={700} mb={2} fontSize="md" colorScheme="gray">
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
                  Request body that caused this error:
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
                    ? JSON.stringify(JSON.parse(exchange.request.body), null, 2)
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
          </Box>;
        })}
      </Box>
    </Box>
  );
};

export default ExchangeMessage;
