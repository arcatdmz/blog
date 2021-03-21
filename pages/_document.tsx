import Document, { Html, Head, Main, NextScript } from "next/document";
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="alternate" type="application/rss+xml" href="/index.xml" />
          <link rel="stylesheet" href="https://junkato.jp/stylesheets/main.css" />
        </Head>
        <Main />
        <NextScript />
      </Html>
    );
  }
}

export default MyDocument;
