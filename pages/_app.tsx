import { MDXProvider } from "@mdx-js/react";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import "../css/style.css";
import "prism-themes/themes/prism-vsc-dark-plus.css";

import websiteJson from "../website.json";
import { MDXComponents } from "../components/MDXComponents";
import { DefaultSEOProps } from "../components/SEO";
import { BlogContext } from "../lib/BlogContext";
import { useGoogleAnalytics } from "../lib/useGoogleAnalytics";
import { useTypeSquareJS } from "../lib/useTypeSquareJS";

export default function App({ Component, pageProps }) {
  useTypeSquareJS();
  useGoogleAnalytics();
  return (
    <MDXProvider components={MDXComponents}>
      <BlogContext.Provider
        value={{
          language: "default",
          rootPath: websiteJson.rootPath,
          imageRoot: websiteJson.imageRoot,
          maxPosts: websiteJson.maxPosts,
          ...websiteJson.languages.default
        }}
      >
        <Head>
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>
        <DefaultSeo {...DefaultSEOProps} />
        <Component {...pageProps} />
      </BlogContext.Provider>
    </MDXProvider>
  );
}
