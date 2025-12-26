import { Metadata } from "next";
import "prism-themes/themes/prism-vsc-dark-plus.css";
import "../css/style.css";

import { ReactNode } from "react";
import { RootLayoutClient } from "./RootLayoutClient";
import websiteJson from "../website.json";

const {
  locale,
  title,
  description,
  siteUrl,
  bannerUrl,
  author
} = websiteJson.languages.default;

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
