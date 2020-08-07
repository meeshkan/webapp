import { AppProps } from "next/app";
import "../components/layout.css";
import { ChakraProvider, CSSReset, Skeleton } from "@chakra-ui/core";
import customTheme from "../theme";
import Navigation from "../components/organisms/navigation";
import Head from "next/head";
import Layout from "../components/layout";
import { useFetchSession } from "../utils/user";
import { isLeft, isRight } from "fp-ts/lib/Either";
import ReactGA from "react-ga";
import SignIn from "../components/organisms/signIn";

function MyApp({ Component, pageProps }: AppProps) {
  const sessionAndThunk = useFetchSession();

  if (global["window"]) {
    ReactGA.initialize("UA-107981669-10");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              isRight(sessionAndThunk[0]) && isRight(sessionAndThunk[0].right)
                ? `window.intercomSettings = { app_id: "${process.env.INTERCOM_ID}", email: "${sessionAndThunk[0].right.right.user.email}"};`
                : `window.intercomSettings = { app_id: "${process.env.INTERCOM_ID}"};`,
          }}
        ></script>
      </Head>
      <ChakraProvider theme={customTheme}>
        <CSSReset />
        <Layout>
          <Navigation session={sessionAndThunk[0]} />
          <Skeleton isLoaded={isRight(sessionAndThunk[0])}>
            {isLeft(sessionAndThunk[0]) ? (
              <></>
            ) : isLeft(sessionAndThunk[0].right) ? (
              <SignIn />
            ) : (
              <Component {...pageProps} />
            )}
          </Skeleton>
        </Layout>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
