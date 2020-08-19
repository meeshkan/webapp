import React from "react";
import {
  Flex,
  useColorMode,
  Stack,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/core";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { LogoIcon } from "../../theme/icons";
import Project from "../molecules/project";
import Link from "next/link";
import { Either, isLeft } from "fp-ts/lib/Either";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { Loading } from "../../utils/hookNeedingFetch";
import { NotAuthorized } from "../../utils/user";
import { useRouter } from "next/router";

interface INavigationProps {
  session: Either<Loading, Either<NotAuthorized, ISession>>;
}

const Navigation = ({ session }: INavigationProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const pathForBreadcrumbs = router.asPath.split("/").slice(1);

  return (
    <>
      <Flex
        p={4}
        align="center"
        justify="space-between"
        backgroundColor={`mode.${colorMode}.card`}
        borderRadius="sm"
        mb={8}
        pos="sticky"
        top={8}
      >
        <Flex
          align="center"
          backgroundColor={`mode.${colorMode}.card`}
          borderRadius="sm"
          height="40px"
        >
          <Link href="/">
            <LogoIcon
              aria-label="Go to homepage"
              color={`mode.${colorMode}.title`}
              h={8}
              w="auto"
              cursor="pointer"
            />
          </Link>
          <Breadcrumb ml={3} mt={2} separator=">">
            {pathForBreadcrumbs.map((crumb, i, pathForBreadcrumbs) => {
              if (pathForBreadcrumbs.length - 1 === i) {
                return (
                  <BreadcrumbItem key={i} isCurrentPage>
                    <BreadcrumbLink color={`mode.${colorMode}.tertiary`}>
                      {crumb}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                );
              } else {
                const url = pathForBreadcrumbs.slice(0, i + 1).join("/");
                return (
                  <BreadcrumbItem key={i}>
                    <BreadcrumbLink
                      href={`/${url}`}
                      color={`mode.${colorMode}.tertiary`}
                    >
                      {crumb}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                );
              }
            })}
          </Breadcrumb>
        </Flex>
        {!isLeft(session) && (
          <section>
            {isLeft(session.right) ? (
              <Stack direction="row" spacing={4}>
                <IconButton
                  aria-label={`Switch to ${
                    colorMode === "light" ? "dark" : "light"
                  } mode`}
                  color={`mode.${colorMode}.text`}
                  onClick={toggleColorMode}
                  transition="all 0.2s"
                  icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
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
