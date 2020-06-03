import React from "react";
import {
  Icon,
  Box,
  Flex,
  useColorMode,
  Button,
  LightMode,
  Stack,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "@chakra-ui/core";
import Project from "../molecules/project";
import Link from "next/link";
import { Either, isLeft, isRight } from "fp-ts/lib/Either";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { Loading } from "../../utils/hookNeedingFetch";
import { NotAuthorized } from "../../utils/user";

interface INavigationProps {
  session: Either<Loading, Either<NotAuthorized, ISession>>;
}

const Navigation = ({ session }: INavigationProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

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
        top={8}
      >
        <Flex
          align="center"
          backgroundColor={`mode.${colorMode}.card`}
          rounded="sm"
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
          <Breadcrumb ml={3} mt={2} addSeparator={true}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" color={`mode.${colorMode}.tertiary`}>
                Example
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color={`mode.${colorMode}.tertiary`} href="#">
                Another
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        {!isLeft(session) && (
          <section>
            {isLeft(session.right) ? (
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
            ) : (
              <Project session={session.right.right} />
            )}
          </section>
        )}
      </Flex>
    </>
  );
};

export default Navigation;
