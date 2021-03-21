import { MDXProvider } from "@mdx-js/react";
import { DefaultSeo } from "next-seo";
import Head from "next/head";

import { LayoutWrapper } from "../components/LayoutWrapper";
import { MDXComponents } from "../components/MDXComponents";
import { SEO } from "../components/SEO";

export default function App({ Component, pageProps }) {
  return (
    <MDXProvider components={MDXComponents}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo {...SEO} />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </MDXProvider>
  );
}
