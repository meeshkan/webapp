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
import { useFetchUser } from "../../utils/user";

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
          </MenuGroup>
          <MenuDivider />
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
