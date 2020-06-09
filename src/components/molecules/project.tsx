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
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { useTeams } from "../../utils/teams";
import { isLeft } from "fp-ts/lib/Either";

interface IProjectSettingsProps {
  session: ISession;
}

const ProjectSettings = ({ session }: IProjectSettingsProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
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
      <Menu closeOnSelect={false}>
        <MenuButton
          display="flex"
          alignItems="center"
          backgroundColor={`mode.${colorMode}.background`}
          rounded="sm"
        >
          <Image
            src={session.user.picture}
            fallbackSrc="https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
            alt={`${session.user.name}'s headshot`}
            size={10}
            roundedLeft="sm"
            border="1px solid"
            borderColor={`mode.${colorMode}.background`}
          />
          <Text ml={2} mr={8} color={`mode.${colorMode}.text`}>
            {session.user.nickname}
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
              <Icon name={colorMode === "light" ? "moon" : "sun"} mr={3} />
              {colorMode === "light" ? "Dark mode" : "Light mode"}
            </MenuItem>
          </MenuGroup>
          <MenuDivider borderColor={`mode.${colorMode}.icon`} />
          <MenuGroup title="Teams" color={`mode.${colorMode}.title`}>
            {teams.map((team, index) => (
              <Link
                href={`/${team.name}/`}
                key={index}
                aria-label={`Links to ${team.name}'s dashboard`}
              >
                <MenuItem
                  color={`mode.${colorMode}.text`}
                  d="flex"
                  alignContent="center"
                >
                  <Image
                    src={
                      team.image
                        ? team.image.downloadUrl
                        : "https://picsum.photos/200"
                    }
                    fallbackSrc="https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
                    alt={`${team.name}'s organization image`}
                    rounded="sm"
                    border="1px solid"
                    borderColor={`mode.${colorMode}.icon`}
                    h={4}
                    w={4}
                    mr={2}
                  />
                  {team.name}
                </MenuItem>
              </Link>
            ))}
          </MenuGroup>

          <MenuDivider borderColor={`mode.${colorMode}.icon`} />

          <MenuGroup title="Other" color={`mode.${colorMode}.title`}>
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
