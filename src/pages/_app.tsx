import { AppProps } from "next/app";
import "../components/layout.css";
import {
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
  Skeleton,
} from "@chakra-ui/core";
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
        <title>Meeshkan Webapp</title>
        <link rel="icon" href="/icon.png" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-107981669-10"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-107981669-10');`,
          }}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html:
              isRight(sessionAndThunk[0]) && isRight(sessionAndThunk[0].right)
                ? `window.intercomSettings = { app_id: "${process.env.INTERCOM_ID}", email: "${sessionAndThunk[0].right.right.user.email}"};`
                : `window.intercomSettings = { app_id: "${process.env.INTERCOM_ID}"};`,
          }}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/nou4ik17';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`,
          }}
        ></script>
      </Head>
      <ThemeProvider theme={customTheme}>
        <CSSReset />
        <ColorModeProvider>
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
        </ColorModeProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
