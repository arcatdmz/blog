import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="alternate" type="application/rss+xml" href="/index.xml" />
          <link rel="stylesheet" href="/stylesheets/main.css" />
          <script
            type="text/javascript"
            src="//webfonts.sakura.ne.jp/js/sakurav3.js"
          ></script>
        </Head>
        <Main />
        <NextScript />
      </Html>
    );
  }
}

export default MyDocument;
