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
import { useFetchUser } from "../utils/user";
import { useFetchProjects } from "../utils/projects";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const { colorMode } = useColorMode();
  const [ user, loadingUser ] = useFetchUser();
  const [ projects, loadingProjects ] = useFetchProjects();
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
            <Navigation user={user} loadingUser={loadingUser} />
            {!user && (
              <Skeleton isLoaded={!loadingUser && !loadingProjects}>
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
              </Skeleton>
            )}
            {user && projects && <Component {...pageProps} />}
          </Layout>
        </ColorModeProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
