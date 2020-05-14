import React, { useState } from "react";
import {
  Box,
  useColorMode,
  Grid,
  Stack,
  FormControl,
  Input,
  FormLabel,
  Button,
  Icon,
  Tooltip,
  Flex,
  Switch,
  LightMode,
  Link,
  IconButton,
} from "@chakra-ui/core";
import Card from "../../../components/molecules/card";
import { ItemLink, stringToUrl } from "../../../components/molecules/navLink";

const items = ["Build settings", "Environment variables", "Slack integration"];

const ConfigurationPage = ({ user }) => {
  const { colorMode } = useColorMode();
  const [notifications, setNotificaitons] = useState(false);

  const slackClick = (e) => {
    e.preventDefault();
    window.location.assign(
      `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_OAUTH_APP_CLIENT_ID}&scope=incoming-webhook&state=${user.node_id}&redirect_uri=${process.env.SLACK_OAUTH_REDIRECT_URI}`
    );
  };

  return (
    <Grid
      templateColumns={[
        "repeat(auto-fit, 1fr)",
        "repeat(2, 1fr)",
        "repeat(3, 1fr)",
        "repeat(4, 1fr)",
      ]}
      gap={20}
    >
      <Box
        bg={`mode.${colorMode}.card`}
        rounded="sm"
        pos="sticky"
        top={136}
        p={4}
        gridArea="1 / 1 / 2 / 2"
      >
        {items.map((link) => (
          <ItemLink href={stringToUrl(link)}>{link}</ItemLink>
        ))}
      </Box>
      <Stack w="100%" spacing={8} gridArea="1 / 2 / 4 / 4" overflow="scroll">
        <Card heading="Build settings">
          <FormControl d="flex" alignItems="center" mt={4}>
            <FormLabel
              fontWeight={500}
              color={`mode.${colorMode}.title`}
              minW="160px"
              mr={4}
              p={0}
            >
              Root directory
              <Tooltip
                hasArrow
                label="Where is your app located in this repository?"
                aria-label="Where is your app located in this repository?"
                placement="right"
              >
                <Icon
                  name="info"
                  size="12px"
                  ml={2}
                  color={`mode.${colorMode}.text`}
                />
              </Tooltip>
            </FormLabel>
            <Input
              borderColor={`mode.${colorMode}.icon`}
              color={`mode.${colorMode}.text`}
              rounded="sm"
              size="sm"
            />
          </FormControl>

          <FormControl d="flex" alignItems="center" mt={4}>
            <FormLabel
              fontWeight={500}
              color={`mode.${colorMode}.title`}
              minW="160px"
              mr={4}
              p={0}
            >
              Build command
              <Tooltip
                hasArrow
                label="The command(s) your app framework provides for compiling your code."
                aria-label="The command(s) your app framework provides for compiling your code."
                placement="right"
              >
                <Icon
                  name="info"
                  size="12px"
                  ml={2}
                  color={`mode.${colorMode}.text`}
                />
              </Tooltip>
            </FormLabel>
            <Input
              borderColor={`mode.${colorMode}.icon`}
              color={`mode.${colorMode}.text`}
              rounded="sm"
              size="sm"
            />
          </FormControl>

          <FormControl d="flex" alignItems="center" my={4}>
            <FormLabel
              fontWeight={500}
              color={`mode.${colorMode}.title`}
              minW="160px"
              mr={4}
              p={0}
            >
              OpenAPI location
              <Tooltip
                hasArrow
                label="Where is your OpenAPI spec located in this repository?"
                aria-label="Where is your OpenAPI spec located in this repository?"
                placement="right"
              >
                <Icon
                  name="info"
                  size="12px"
                  ml={2}
                  color={`mode.${colorMode}.text`}
                />
              </Tooltip>
            </FormLabel>
            <Input
              borderColor={`mode.${colorMode}.icon`}
              color={`mode.${colorMode}.text`}
              rounded="sm"
              size="sm"
            />
          </FormControl>

          <Flex justifyContent="flex-end">
            <LightMode>
              <Button
                size="sm"
                px={4}
                rounded="sm"
                fontWeight={900}
                variantColor="blue"
                type="submit"
              >
                Save
              </Button>
            </LightMode>
          </Flex>
        </Card>

        <Box h={4} />

        <Card heading="Environment variables">
          <Stack as="form" isInline align="flex-end" spacing={4} mt={4}>
            <FormControl w="100%" isRequired>
              <FormLabel fontWeight={500} color={`mode.${colorMode}.title`}>
                Name
              </FormLabel>
              <Input
                borderColor={`mode.${colorMode}.icon`}
                color={`mode.${colorMode}.text`}
                rounded="sm"
                size="sm"
              />
            </FormControl>
            <FormControl w="100%" isRequired>
              <FormLabel fontWeight={500} color={`mode.${colorMode}.title`}>
                Value
              </FormLabel>
              <Input
                borderColor={`mode.${colorMode}.icon`}
                color={`mode.${colorMode}.text`}
                rounded="sm"
                size="sm"
              />
            </FormControl>
            <LightMode>
              <Button
                size="sm"
                px={4}
                rounded="sm"
                fontWeight="900"
                variantColor="blue"
                type="submit"
              >
                Add
              </Button>
            </LightMode>
          </Stack>

          <Box as="table" textAlign="left" mt={8} width="full">
            <Box
              as="tr"
              backgroundColor={`mode.${colorMode}.background`}
              rounded="sm"
              border="1px solid"
              borderColor={`mode.${colorMode}.icon`}
            >
              <Box
                roundedTop="sm"
                as="th"
                p={2}
                fontWeight="semibold"
                fontSize="sm"
                color={`mode.${colorMode}.title`}
              >
                Name
              </Box>
              <Box
                as="th"
                p={2}
                fontWeight="semibold"
                fontSize="sm"
                color={`mode.${colorMode}.title`}
              >
                Value
              </Box>
              <Box as="th" p={2} fontWeight="semibold" fontSize="sm"></Box>
            </Box>

            <Box as="tr">
              <Box
                as="td"
                p={2}
                borderBottomWidth="1px"
                borderColor={`mode.${colorMode}.icon`}
                color={`mode.${colorMode}.text`}
                fontSize="sm"
                whiteSpace="normal"
              >
                GRAPHCMS_ENDPOINT
              </Box>
              <Box
                as="td"
                p={2}
                borderBottomWidth="1px"
                borderColor={`mode.${colorMode}.icon`}
                color={`mode.${colorMode}.text`}
                fontSize="sm"
                whiteSpace="normal"
              >
                https://api-eu-central-1.graphcms.com/v2/ck9bm6pqe04r901yy473r544s/master
              </Box>
              <Box
                as="td"
                borderBottomWidth="1px"
                borderColor={`mode.${colorMode}.icon`}
              >
                <IconButton
                  icon="delete"
                  aria-label="Delete button"
                  variant="ghost"
                  rounded="sm"
                  size="sm"
                  color={`mode.${colorMode}.text`}
                  _hover={{ color: "red.500" }}
                />
              </Box>
            </Box>
          </Box>
        </Card>

        <Box h={4} />

        <Card heading="Slack integration">
          <Flex justifyContent="space-between" my={4}>
            <FormLabel color={`mode.${colorMode}.text`}>
              Global notifications {notifications == true ? "on" : "off"}
            </FormLabel>
            <Switch
              isChecked={notifications}
              onChange={() => setNotificaitons(!notifications)}
            />
          </Flex>
          <Link
            color={colorMode === "light" ? "blue.500" : "blue.200"}
            onClick={slackClick}
            verticalAlign="middle"
          >
            <Icon name="slack" mr={2} />
            Install the slack app here
          </Link>
        </Card>
      </Stack>
    </Grid>
  );
};

export default ConfigurationPage;
