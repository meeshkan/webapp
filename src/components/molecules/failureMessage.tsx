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

type FailureProps = {
  method: string;
  path: string;
  headers?: string;
  query?: string;
};

const FailureMessage = ({ method, path, headers, query }: FailureProps) => {
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
              {method.toUpperCase()}
            </Text>
            <Text fontWeight={600} color={`mode.${colorMode}.text`}>
              {path}
            </Text>
          </Flex>
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel py={4}>
        {headers && (
          <Text mb={2} color={`mode.${colorMode}.text`}>
            {headers}
          </Text>
        )}
        {query && (
          <>
            <Text mb={2} color={`mode.${colorMode}.text`}>
              This bug was found while issuing the following command:
            </Text>
            <CodeBlock className="bash">{query}</CodeBlock>
          </>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default FailureMessage;
