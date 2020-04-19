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
  Button,
} from "@chakra-ui/core";

const ProjectSettings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
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
      <MenuList>
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
          <Icon name="external-link" mr={3} />
          Authorize another
        </MenuItem>
        <MenuDivider />
        <MenuGroup>
          <MenuItem color={`mode.${colorMode}.text`}>Docs</MenuItem>
          <MenuItem color={`mode.${colorMode}.text`}>Support</MenuItem>
          <MenuItem
            aria-label={`Switch to ${
              colorMode === "light" ? "dark" : "light"
            } mode`}
            color={`mode.${colorMode}.title`}
            onClick={toggleColorMode}
            transition="all 0.2s"
          >
            <Icon name={colorMode === "light" ? "moon" : "sun"} mr={2} />
            {colorMode === "light" ? "Dark mode" : "Light mode"}
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default ProjectSettings;
