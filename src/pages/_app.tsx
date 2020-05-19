import { AppProps } from "next/app";
import "../components/layout.css";
import {
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
  Box,
  Heading,
  Button,
  useColorMode,
  Skeleton,
  Flex,
} from "@chakra-ui/core";
import customTheme from "../theme";
import Navigation from "../components/organisms/navigation";
import Head from "next/head";
import Layout from "../components/layout";
import { useFetchSession } from "../utils/user";
import { useRouter } from "next/router";
import { isLeft, isRight } from "fp-ts/lib/Either";

function MyApp({ Component, pageProps }: AppProps) {
  const { colorMode } = useColorMode();
  const sessionAndThunk = useFetchSession();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Meeshkan Webapp</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <ThemeProvider theme={customTheme}>
        <CSSReset />
        <ColorModeProvider>
          <Layout>
            <Navigation session={sessionAndThunk[0]} />
            <Skeleton isLoaded={isRight(sessionAndThunk[0])}>
                {isLeft(sessionAndThunk[0]) ? <></> : isLeft(sessionAndThunk[0].right) ?
                <Box as="section" my={12}>
                  <Heading
                    as="h2"
                    color={`mode.${colorMode}.title`}
                    textAlign="center"
                    mb={4}
                  >
                    Sign in to start using Meeshkan
                  </Heading>
                  <Flex justify="center">
                    <Button
                      rounded="sm"
                      mr={4}
                      fontWeight="900"
                      variantColor="red"
                      onClick={() => router.push("/api/login")}
                    >
                      Sign in
                    </Button>
                    <Button
                      rounded="sm"
                      fontWeight="900"
                      variantColor="red"
                      onClick={() => router.push("/api/login")}
                    >
                      Sign up
                    </Button>
                  </Flex>
                </Box>
                : <Component {...pageProps} />}
              </Skeleton>
          </Layout>
        </ColorModeProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
