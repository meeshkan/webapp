import React, { forwardRef } from "react";
import { Box, useColorMode } from "@chakra-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";

const NavLink = ({ children, href, ...props }) => {
  let isActive = false;
  let router = useRouter();

  if (router.pathname === href) {
    isActive = true;
  } else {
    isActive = false;
  }

  return (
    <Link href={href} {...props}>
      <a>{typeof children === "function" ? children(isActive) : children}</a>
    </Link>
  );
};

export const stringToUrl = (str) =>
  `#${str.toLowerCase().split(" ").join("-")}`;

type SideNavLinkProps = {
  children: Object;
};

export const SideNavLink = forwardRef(
  ({ children, ...props }: SideNavLinkProps, ref) => {
    return (
      <Box
        // @ts-expect-error
        ref={ref}
        mx={-2}
        display="flex"
        cursor="pointer"
        verticalAlign="center"
        px={2}
        py="1"
        transition="all 0.2s"
        fontWeight={700}
        outline="none"
        _focus={{ boxShadow: "outline", fontWeight: 900 }}
        _notFirst={{ mt: 1 }}
        {...props}
      >
        <Box>{children}</Box>
      </Box>
    );
  }
);

type LinkProps = {
  href: String;
  children: String;
};

export const ItemLink = forwardRef(
  ({ href, children, ...props }: LinkProps, ref) => {
    const { colorMode } = useColorMode();

    return (
      <NavLink href={href}>
        {(isActive) => (
          <SideNavLink
            ref={ref}
            aria-current={isActive ? "page" : undefined}
            color={`mode.${colorMode}.text`}
            _hover={{
              color: colorMode === "light" ? "gray.900" : "white",
              transform: "translateX(2px)",
            }}
            {...(isActive && {
              bg: `mode.${colorMode}.bg`,
              borderRadius: "sm",
              color: `mode.${colorMode}.titleHover`,
              _hover: {
                transform: "translateX(2px)",
              },
              fontWeight: 700,
            })}
            {...props}
          >
            {children}
          </SideNavLink>
        )}
      </NavLink>
    );
  }
);
