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
  const fetchedProjectsAndThunk = useTeams(session);
  const projects = isLeft(fetchedProjectsAndThunk[0])
    ? // we are loading
      []
    : isLeft(fetchedProjectsAndThunk[0].right)
    ? // there was an error with the fetch
      []
    : fetchedProjectsAndThunk[0].right.right.flatMap((team) =>
        team.project.items.map((project) => ({
          ...project,
          teamImage: team.image,
          teamName: team.name,
        }))
      );
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
            alt={`${session.user.name}'s headshot`}
            size={10}
            roundedLeft="sm"
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
          <MenuDivider />
          <MenuGroup
            defaultValue="Web app"
            title="Project repo"
            color={`mode.${colorMode}.title`}
          >
            {projects.map(({ teamImage, teamName, name }, index) => (
              <Link
                href={`/${teamName}/${name}`}
                key={index}
                aria-label={`Links to ${teamName}'s project ${name}`}
              >
                <MenuItem
                  color={`mode.${colorMode}.text`}
                  d="flex"
                  alignContent="center"
                >
                  <Image
                    src={
                      teamImage
                        ? teamImage.downloadUrl
                        : "https://picsum.photos/200"
                    }
                    alt={`${teamName}'s organization image`}
                    h={4}
                    w={4}
                    mr={2}
                  />
                  {name}
                </MenuItem>
              </Link>
            ))}
          </MenuGroup>
          <MenuItem color={`mode.${colorMode}.text`}>
            <ChakraLink
              isExternal
              href={`https://github.com/apps/meeshkan/installations/new?state={"env":"${process.env.GITHUB_AUTH_ENV}","id":"${session.user.sub}"}`}
              aria-label="Link to GitHub to install the Meeshkan app on a repository"
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
