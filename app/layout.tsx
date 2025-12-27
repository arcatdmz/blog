import "highlight.js/styles/github-dark-dimmed.css";
import { Metadata } from "next";
import { ReactNode } from "react";

import "../css/style.css";
import websiteJson from "../website.json";
import { RootLayoutClient } from "./RootLayoutClient";

const { locale, title, description, siteUrl, bannerUrl, author } =
  websiteJson.languages.default;

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`
  },
  description,
  authors: [{ name: author }],
  openGraph: {
    type: "website",
    locale,
    url: siteUrl,
    title,
    description,
    ...(bannerUrl && {
      images: [
        {
          url: bannerUrl,
          alt: title,
          width: 1200,
          height: 600
        }
      ]
    })
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="stylesheet" href="/stylesheets/main.css" />
        <link
          key="rss"
          rel="alternate"
          type="application/rss+xml"
          href={`${websiteJson.rootPath}index.xml`}
        />
      </head>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
