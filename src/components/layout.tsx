import React from "react";
import { Stack, InitializeColorMode } from "@chakra-ui/core";

export default function Layout({ children }) {
  return (
    <>
      <InitializeColorMode />
      <Stack minH="100vh" p={8} spacing={0}>
        {children}
      </Stack>
    </>
  );
}
