import React from "react";
import { Stack, useColorMode, InitializeColorMode } from "@chakra-ui/core";
import customTheme from "../theme";

export default function Layout({ children }) {
  const { colorMode } = useColorMode();
  const brandColorTheme = customTheme.colors.mode[colorMode];
  return (
    <>
      <InitializeColorMode />
      <Stack
        minH="100vh"
        p={8}
        spacing={0}
        backgroundColor={brandColorTheme.background}
      >
        {children}
      </Stack>
    </>
  );
}
