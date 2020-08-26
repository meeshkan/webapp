import React, { useState } from "react";
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
  Portal,
  Avatar,
} from "@chakra-ui/core";
import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FallbackIcon } from "../../theme/icons";
import { useRouter } from "next/router";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { useTeams } from "../../utils/teams";
import { isLeft } from "fp-ts/lib/Either";

interface IProjectSettingsProps {
  session: ISession;
}

const ProjectSettings = ({ session }: IProjectSettingsProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isMenuOpen, toggleMenu] = useState(false);
  const router = useRouter();
  const fetchedTeamsAndThunk = useTeams(session);
  const teams = isLeft(fetchedTeamsAndThunk[0])
    ? // we are loading
      []
    : isLeft(fetchedTeamsAndThunk[0].right)
    ? // there was an error with the fetch
      []
    : fetchedTeamsAndThunk[0].right.right;
  return (
    <>
      <Menu closeOnSelect={false} placement="bottom-end">
        <MenuButton
          aria-label={
            isMenuOpen
              ? "Close the navigation menu"
              : "Open the navigation menu"
          }
          display="flex"
          alignItems="center"
          backgroundColor={`mode.${colorMode}.background`}
          borderRadius="sm"
          p={0}
          onClick={() => toggleMenu(!isMenuOpen)}
        >
          <Avatar
            src={session.user.picture}
            showBorder={true}
            borderColor="transparent"
            backgroundColor="transparent"
            icon={<FallbackIcon color={`mode.${colorMode}.icon`} />}
            name={`${session.user.name}'s avatar image`}
            h={10}
            w={10}
            borderRadius="sm"
          />
          <Text
            ml={2}
            mr={8}
            fontWeight={500}
            color={`mode.${colorMode}.tertiary`}
          >
            {session.user.nickname}
          </Text>
          <ChevronDownIcon mr={2} color={`mode.${colorMode}.tertiary`} />
        </MenuButton>
        <Portal>
          <MenuList border="none" backgroundColor={`mode.${colorMode}.card`}>
            <MenuGroup
              title="Settings"
              color={`mode.${colorMode}.title`}
              fontWeight={700}
            >
              <MenuItem
                aria-label={`Switch to ${
                  colorMode === "light" ? "dark" : "light"
                } mode`}
                color={`mode.${colorMode}.text`}
                onClick={toggleColorMode}
                transition="all 0.2s"
              >
                {colorMode === "light" ? (
                  <MoonIcon mr={3} />
                ) : (
                  <SunIcon mr={3} />
                )}
                {colorMode === "light" ? "Dark mode" : "Light mode"}
              </MenuItem>
            </MenuGroup>
            <MenuDivider
              borderColor={`mode.${colorMode}.icon`}
              title="New menu section"
            />
            <MenuGroup
              title="Teams"
              color={`mode.${colorMode}.title`}
              fontWeight={700}
            >
              {teams.map((team, index) => (
                <MenuItem
                  key={index}
                  onClick={() => router.push(`/${team.name}`)}
                  color={`mode.${colorMode}.text`}
                  d="flex"
                  alignContent="center"
                  aria-label={`Links to ${team.name}'s dashboard`}
                >
                  <Image
                    src={team.image && team.image.downloadUrl}
                    fallbackSrc="https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
                    alt={`${team.name}'s organization image`}
                    borderRadius="sm"
                    border="1px solid"
                    borderColor={`mode.${colorMode}.icon`}
                    h={4}
                    w={4}
                    mr={2}
                  />
                  {team.name}
                </MenuItem>
              ))}
            </MenuGroup>

            <MenuDivider
              borderColor={`mode.${colorMode}.icon`}
              title="New menu section"
            />

            <MenuGroup
              title="Other"
              color={`mode.${colorMode}.title`}
              fontWeight={700}
            >
              <MenuItem color={`mode.${colorMode}.text`}>
                <ChakraLink
                  href="https://meeshkan.com/docs/"
                  aria-label="The documentation for how to use Meeshkan"
                  isExternal
                  color={`mode.${colorMode}.text`}
                  _hover={{ textDecor: "none" }}
                >
                  Docs
                </ChakraLink>
              </MenuItem>
              <MenuItem
                color={`mode.${colorMode}.text`}
                onClick={() => router.push(`/api/logout`)}
              >
                <Text>Log out</Text>
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Portal>
      </Menu>
    </>
  );
};

export default ProjectSettings;
