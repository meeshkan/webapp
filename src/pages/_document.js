import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
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
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
