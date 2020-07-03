import React from "react";
import {
  AccordionItem,
  AccordionHeader,
  Box,
  AccordionIcon,
  AccordionPanel,
  useColorMode,
  Text,
  Flex,
  Code,
  Heading,
} from "@chakra-ui/core";
import CodeBlock from "../molecules/codeBlock";
import { ExchangeType } from "../../utils/testLog";
import ReactMarkdown from "react-markdown";
import Renderers from "./markdownComponents";

type FailureProps = {
  exchange: ExchangeType;
  error_message: string;
  priority: number;
  comment: string;
};

const FailureMessage = ({
  exchange,
  error_message,
  priority,
  comment,
}: FailureProps) => {
  const { colorMode } = useColorMode();
  const red = { light: "red.500", dark: "red.300" };
  const yellow = { light: "yellow.500", dark: "yellow.300" };
  const cyan = { light: "cyan.500", dark: "cyan.300" };
  return (
    <AccordionItem
      border="none"
      mb={8}
      rounded="sm"
      color={`mode.${colorMode}.text`}
      backgroundColor={`mode.${colorMode}.card`}
    >
      <AccordionHeader
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
        rounded="sm"
        p={4}
      >
        <Box flex="1" textAlign="left">
          <Flex>
            <Text fontWeight={600} mr={2}>
              {exchange.request.method.toUpperCase()}
            </Text>
            <Text fontWeight={600} color={`mode.${colorMode}.text`}>
              {exchange.meta.path}
            </Text>
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
      </AccordionHeader>
      <AccordionPanel py={4}>
        <Flex>
          {error_message && (
            <Text mb={2} mr={2} color={`mode.${colorMode}.text`}>
              {error_message}
            </Text>
          )}
          {exchange.response.statusCode && (
            <Code fontWeight={700} mb={2} fontSize="md" variantColor="gray">
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
              {exchange.request.body}
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
  );
};

export default FailureMessage;
