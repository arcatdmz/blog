import { NextSeo, ArticleJsonLd } from "next-seo";
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

export const PageSeo = ({ title, description, url }) => {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={url}
      openGraph={{
        url,
        title,
        description
      }}
    />
  );
};

interface BlogSeoProps extends PostIface {
  url?: string;
  images?: string | string[];
}

export const BlogSeo: FC<BlogSeoProps> = ({
  title,
  summary,
  date,
  lastmod,
  url,
  tags,
  images = [],
  coverImage
}) => {
  const {
    imageRoot,
    bannerUrl,
    siteUrl,
    title: siteTitle,
    author,
    authorUrl
  } = useContext(BlogContext);

  const publishedAt = new Date(date).toISOString();
  const modifiedAt = new Date(lastmod || date).toISOString();
  let imagesArr =
    images.length === 0
      ? [bannerUrl]
      : typeof images === "string"
      ? [images]
      : images;

  const featuredImages = imagesArr.map(img => {
    return {
      url: `${siteUrl}${img}`,
      alt: title
    };
  });
  if (coverImage) {
    featuredImages.unshift({
      url: `${imageRoot}${coverImage}`,
      alt: title
    });
  }

  return (
    <>
      <NextSeo
        title={`${title} – ${siteTitle}`}
        description={summary}
        canonical={url}
        openGraph={{
          type: "article",
          article: {
            publishedTime: publishedAt,
            modifiedTime: modifiedAt,
            authors: [authorUrl],
            tags
          },
          url,
          title,
          description: summary,
          images: featuredImages
        }}
        additionalMetaTags={[
          {
            name: "twitter:image",
            content: featuredImages[0].url
          }
        ]}
      />
      <ArticleJsonLd
        authorName={author}
        dateModified={publishedAt}
        datePublished={modifiedAt}
        description={summary}
        images={
          (featuredImages && featuredImages.map(image => image.url)) || null
        }
        publisherName={author}
        publisherLogo={null}
        title={title}
        url={url}
      />
    </>
  );
};
