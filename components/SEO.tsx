import { NextSeo, ArticleJsonLd } from "next-seo";
import { FC } from "react";

import websiteJson from "../website.json";
import { PostIface } from "../lib/PostIface";

export const SEO = {
  title: websiteJson.title,
  description: websiteJson.description,
  openGraph: {
    type: "website",
    locale: websiteJson.language,
    url: websiteJson.siteUrl,
    title: websiteJson.title,
    description: websiteJson.description,
    images: [
      {
        url: `${websiteJson.siteUrl}${websiteJson.socialBanner}`,
        alt: websiteJson.title,
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
      content: websiteJson.author
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
  const publishedAt = new Date(date).toISOString();
  const modifiedAt = new Date(lastmod || date).toISOString();
  let imagesArr =
    images.length === 0
      ? [websiteJson.socialBanner]
      : typeof images === "string"
      ? [images]
      : images;

  const featuredImages = imagesArr.map(img => {
    return {
      url: `${websiteJson.siteUrl}${img}`,
      alt: title
    };
  });
  if (coverImage) {
    featuredImages.unshift({
      url: `${websiteJson.siteUrl}/images/${coverImage}`,
      alt: title
    });
  }

  return (
    <>
      <NextSeo
        title={`${title} – ${websiteJson.title}`}
        description={summary}
        canonical={url}
        openGraph={{
          type: "article",
          article: {
            publishedTime: publishedAt,
            modifiedTime: modifiedAt,
            authors: [`${websiteJson.siteUrl}/about`],
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
        authorName={websiteJson.author}
        dateModified={publishedAt}
        datePublished={modifiedAt}
        description={summary}
        images={
          (featuredImages && featuredImages.map(image => image.url)) || null
        }
        publisherName={websiteJson.author}
        publisherLogo={null}
        title={title}
        url={url}
      />
    </>
  );
};
