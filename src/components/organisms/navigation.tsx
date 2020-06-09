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
import { useRouter } from 'next/router'

interface INavigationProps {
  session: Either<Loading, Either<NotAuthorized, ISession>>;
}

const Navigation = ({ session }: INavigationProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter()
  const pathForBreadcrumbs = router.asPath.split("/").slice(1);

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
            {pathForBreadcrumbs.map((crumb, i, pathForBreadcrumbs) => {
              if (pathForBreadcrumbs.length - 1 === i) {
                return(
                  <BreadcrumbItem key={i} isCurrentPage>
                    <BreadcrumbLink color={`mode.${colorMode}.tertiary`}>
                      {crumb}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )
              } else {
                return(
                  <BreadcrumbItem key={i}>
                    <BreadcrumbLink href={`/${crumb}`} color={`mode.${colorMode}.tertiary`}>
                      {crumb}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )
              }
              })}
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
