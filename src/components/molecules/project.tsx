import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Link as ChakraLink,
  MenuDivider,
  useColorMode,
  Image,
  Text,
  Icon,
} from "@chakra-ui/core";
import Link from "next/link";
import { useFetchUser } from "../../utils/user";
import { repos } from "../../data/repoQuery";

const ProjectSettings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user } = useFetchUser();

  return (
    <>
      <Menu closeOnSelect={false}>
        <MenuButton
          display="flex"
          alignItems="center"
          backgroundColor={`mode.${colorMode}.background`}
        >
          <Image
            src={user.picture}
            size={10}
            roundedLeft="sm"
            borderColor={`mode.${colorMode}.background`}
          />
          <Text ml={2} mr={8} color={`mode.${colorMode}.text`}>
            {user.nickname}
          </Text>
          <Icon name="chevron-down" mr={2} color={`mode.${colorMode}.text`} />
        </MenuButton>
        <MenuList
          border="none"
          placement="bottom-end"
          backgroundColor={`mode.${colorMode}.card`}
        >
          <MenuGroup title="Settings" color={`mode.${colorMode}.title`}>
            <MenuItem
              aria-label={`Switch to ${
                colorMode === "light" ? "dark" : "light"
              } mode`}
              color={`mode.${colorMode}.text`}
              onClick={toggleColorMode}
              transition="all 0.2s"
            >
              <Icon name={colorMode === "light" ? "moon" : "sun"} mr={2} />
              {colorMode === "light" ? "Dark mode" : "Light mode"}
            </MenuItem>
            <MenuItem color={`mode.${colorMode}.text`}>
              <ChakraLink
                href={`https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_OAUTH_APP_CLIENT_ID}&scope=incoming-webhook&state=${user.node_id}&redirect_uri=${process.env.SLACK_OAUTH_REDIRECT_URI}`}
                isExternal
                color={`mode.${colorMode}.text`}
                _hover={{ textDecor: "none" }}
              >
                <Icon name="slack" mr={2} /> Install Slack app
              </ChakraLink>
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup
            defaultValue="Web app"
            title="Project repo"
            color={`mode.${colorMode}.title`}
          >
            {user.projects.map(
              ({ owner: { login, avatarUrl }, name }, index) => (
                <Link href={`/${login}/${name}`} key={index}>
                  <MenuItem
                    color={`mode.${colorMode}.text`}
                    d="flex"
                    alignContent="center"
                  >
                    <Image src={avatarUrl} h={4} w={4} mr={2} />
                    {name}
                  </MenuItem>
                </Link>
              )
            )}
          </MenuGroup>
          <MenuItem color={`mode.${colorMode}.text`}>
            <ChakraLink
              isExternal
              href="https://github.com/apps/meeshkan/installations/new"
              color={`mode.${colorMode}.text`}
              _hover={{ textDecor: "none" }}
            >
              <Icon name="external-link" mr={2} />
              Authorize another
            </ChakraLink>
          </MenuItem>
          <MenuDivider />
          <MenuGroup title="Other" color={`mode.${colorMode}.title`}>
            <MenuItem color={`mode.${colorMode}.text`}>
              <ChakraLink
                href="https://meeshkan.com/docs/"
                isExternal
                color={`mode.${colorMode}.text`}
                _hover={{ textDecor: "none" }}
              >
                Docs
              </ChakraLink>
            </MenuItem>
            <MenuItem color={`mode.${colorMode}.text`}>
              <Link href="/api/logout">
                <Text>Log out</Text>
              </Link>
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </>
  );
};

export default ProjectSettings;
