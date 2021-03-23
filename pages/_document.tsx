import Document, { Html, Head, Main, NextScript } from "next/document";
import { GA_TRACKING_ID } from "../lib/useGoogleAnalytics";

const __html = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_TRACKING_ID}', {
  page_path: window.location.pathname,
});`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="stylesheet" href="/stylesheets/main.css" />
          <script
            type="text/javascript"
            src="//webfonts.sakura.ne.jp/js/sakurav3.js"
          ></script>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html
            }}
          />
        </Head>
        <Main />
        <NextScript />
      </Html>
    );
  }
}

export default MyDocument;
