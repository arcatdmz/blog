"use client"
import { FC, useContext } from "react";

import websiteJson from "../website.json";
import { BlogContext } from "../lib/BlogContext";
import { PostIface } from "../lib/PostIface";

const {
  locale,
  title,
  description,
  siteUrl,
  bannerUrl,
  author
} = websiteJson.languages.default;

export const DefaultSEOProps = {
  title,
  description,
  openGraph: {
    type: "website",
    locale,
    url: siteUrl,
    title,
    description,
    images: [
      {
        url: bannerUrl,
        alt: title,
        width: 1200,
        height: 600
      }
    ]
  },
  //   twitter: {
  //     handle: websiteJson.twitter,
  //     site: websiteJson.twitter,
  //     cardType: "summary_large_image",
  //   },
  additionalMetaTags: [
    {
      name: "author",
      content: author
    }
  ]
};

// No-op components for App Router - metadata is handled at page level
export const PageSeo = ({ title, description, url }: { title: string; description: string; url: string }) => {
  return null;
};

interface BlogSeoProps extends PostIface {
  url?: string;
  images?: string | string[];
}

export const BlogSeo: FC<BlogSeoProps> = () => {
  return null;
};
