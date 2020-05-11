import React from "react";
import {
  Icon,
  Flex,
  useColorMode,
  Button,
  LightMode,
  Stack,
  IconButton,
} from "@chakra-ui/core";
import Project from "../molecules/project";
import Link from "next/link";
import { useFetchUser } from "../../utils/user";
import { useRouter } from "next/router";

const Navigation = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, loadingUser } = useFetchUser();
  const router = useRouter();

  return (
    <>
      <Flex
        p={4}
        align="center"
        justify="space-between"
        backgroundColor={`mode.${colorMode}.card`}
        rounded="sm"
        mb={8}
        pos="sticky"
        top={4}
      >
        <Link href="/">
          <Icon
            name="Logo"
            color={`mode.${colorMode}.title`}
            h={8}
            w="auto"
            cursor="pointer"
          />
        </Link>
        {!loadingUser && (
          <section>
            {!user && (
              <Stack isInline spacing={4}>
                <IconButton
                  aria-label={`Switch to ${
                    colorMode === "light" ? "dark" : "light"
                  } mode`}
                  color={`mode.${colorMode}.text`}
                  onClick={toggleColorMode}
                  transition="all 0.2s"
                  icon={colorMode === "light" ? "moon" : "sun"}
                  mr={2}
                />
              </Stack>
            )}
            {user && <Project />}
          </section>
        )}
      </Flex>
    </>
  );
};

export default Navigation;
