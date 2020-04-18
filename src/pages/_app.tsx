import { AppProps } from "next/app";
import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";
import customTheme from "../theme";
import Navigation from "../components/navigation";
import Head from "next/head";
import Layout from "../components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Meeshkan Webapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={customTheme}>
        <CSSReset />
        <ColorModeProvider>
          <Layout>
            <Navigation />
            <Component {...pageProps} />
          </Layout>
        </ColorModeProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
