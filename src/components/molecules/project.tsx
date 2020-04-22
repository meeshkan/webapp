import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  useColorMode,
  Image,
  Text,
  Icon,
} from "@chakra-ui/core";
import Link from "next/link";

const ProjectSettings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Menu closeOnSelect={false}>
        <MenuButton
          display="flex"
          alignItems="center"
          backgroundColor={`mode.${colorMode}.background`}
        >
          <Image
            src="https://media.graphcms.com/GFjpdH7nTwSWUMaHn6HY"
            size={10}
            roundedLeft="sm"
            borderColor={`mode.${colorMode}.background`}
          />
          <Text ml={2} mr={8} color={`mode.${colorMode}.text`}>
            Web app
          </Text>
          <Icon name="chevron-down" mr={2} color={`mode.${colorMode}.text`} />
        </MenuButton>
        <MenuList
          border="none"
          placement="bottom-end"
          backgroundColor={`mode.${colorMode}.background`}
        >
          <MenuOptionGroup
            defaultValue="Web app"
            title="Project repo"
            type="radio"
            color={`mode.${colorMode}.title`}
          >
            <MenuItemOption color={`mode.${colorMode}.text`} value="Web app">
              Web app
            </MenuItemOption>
            <MenuItemOption color={`mode.${colorMode}.text`} value="Website">
              Website
            </MenuItemOption>
          </MenuOptionGroup>
          <MenuItem color={`mode.${colorMode}.text`}>
            <a href="https://github.com/apps/meeshkan/installations/new">
              Authorize another
            </a>
          </MenuItem>
          <MenuDivider />
          <MenuGroup title="Other" color={`mode.${colorMode}.title`}>
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
              <Link href="/docs">
                <a>Docs</a>
              </Link>
            </MenuItem>
            <MenuItem color={`mode.${colorMode}.text`}>
              <Link href="/api/logout">
                <a>Log out</a>
              </Link>
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </>
  );
};

export default ProjectSettings;
