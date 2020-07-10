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
import { ExchangeType } from "../../utils/testLog";
import ReactMarkdown from "react-markdown";
import Renderers from "./markdownComponents";
import prettier from "prettier";

type FailureProps = {
  exchange: ExchangeType;
  error_message: string;
  priority: number;
  comment: string;
  method: string;
};

const FailureMessage = ({
  exchange,
  error_message,
  priority,
  comment,
  method,
}: FailureProps) => {
  const { colorMode } = useColorMode();
  const red = { light: "red.500", dark: "red.300" };
  const yellow = { light: "yellow.500", dark: "yellow.300" };
  const cyan = { light: "cyan.500", dark: "cyan.300" };
  return (
    <Accordion defaultIndex={[0]} allowMultiple __css={{}}>
      <AccordionItem
        border="none"
        mb={8}
        borderRadius="sm"
        color={`mode.${colorMode}.text`}
        backgroundColor={`mode.${colorMode}.card`}
        __css={{}}
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
          __css={{}}
        >
          <Box flex="1" textAlign="left">
            <Flex>
              <Text fontWeight={600} mr={2}>
                {method.toUpperCase()}
              </Text>
              <Text fontWeight={600}>{exchange.meta.path}</Text>
              {priority && (
                <Text
                  color={
                    priority >= 4
                      ? cyan[colorMode]
                      : priority >= 3
                      ? yellow[colorMode]
                      : priority >= 0
                      ? red[colorMode]
                      : "gray.500"
                  }
                  fontWeight={900}
                  ml={4}
                >
                  Priority level {priority}
                </Text>
              )}
            </Flex>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel py={4} __css={{}}>
          <Flex>
            {error_message && (
              <Text mb={2} mr={2}>
                {error_message}
              </Text>
            )}
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
                  ? exchange.request.body
                  : exchange.meta.apiType === "graphql"
                  ? prettier.format(
                      JSON.parse(exchange.request.body)["query"],
                      { parser: "graphql" }
                    )
                  : exchange.request.body}
              </CodeBlock>
            </>
          )}
          {comment && (
            <ReactMarkdown
              source={comment}
              // @ts-expect-error
              renderers={Renderers}
            />
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default FailureMessage;
