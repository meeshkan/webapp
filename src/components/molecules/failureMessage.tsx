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
} from "@chakra-ui/core";
import CodeBlock from "../molecules/codeBlock";
import { ExchangeType } from "../../utils/testLog";

type FailureProps = {
  exchange: ExchangeType;
  error_message: string;
};

const FailureMessage = ({ exchange, error_message }: FailureProps) => {
  const { colorMode } = useColorMode();
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
          </Flex>
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel py={4}>
        {exchange.request.headers &&
          Object.keys(exchange.request.headers).length > 0 && (
            <Text mb={2} color={`mode.${colorMode}.text`}>
              {JSON.stringify(exchange.request.headers)}
            </Text>
          )}
        {exchange.request.query &&
          Object.keys(exchange.request.query).length > 0 && (
            <>
              <Text mb={2} color={`mode.${colorMode}.text`}>
                This bug was found while issuing the following command:
              </Text>
              <CodeBlock className="bash">
                {JSON.stringify(exchange.request.query)}
              </CodeBlock>
            </>
          )}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default FailureMessage;
