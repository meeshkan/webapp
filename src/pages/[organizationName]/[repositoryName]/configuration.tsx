import React from "react";
import { Box, Text, useColorMode, Flex, Stack } from "@chakra-ui/core";
import Card from "../../../components/molecules/card";

const ConfigurationPage = () => {
  const { colorMode } = useColorMode();
  return (
    <Box maxW="1000px" mx="auto" h="100%">
      <Flex w="100%">
        <Box bg={`mode.${colorMode}.card`} rounded="sm" mr={20} p={4}>
          <Text>Build settings</Text>
          <Text>Environment variables</Text>
          <Text>Slack integration</Text>
        </Box>
        <Stack w="100%">
          <Card heading="Slack integration">
            <Text>Add stuff here</Text>
          </Card>
        </Stack>
      </Flex>
    </Box>
  );
};

export default ConfigurationPage;
