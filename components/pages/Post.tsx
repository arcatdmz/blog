"use client";

import { PostIface } from "../../lib/PostIface";
import { BaseLayout } from "../layouts/BaseLayout";
import { PostLayout } from "../layouts/PostLayout";

export interface PostProps {
  post: {
    contentHtml: string;
    frontMatter: PostIface;
  };
  prev?: PostIface;
  next?: PostIface;
  language: string;
  sourceRoot: string;
}

export const Post = ({ post, prev, next, language, sourceRoot }: PostProps) => {
  const { contentHtml, frontMatter } = post;
  const sourceUrl = `${sourceRoot}${language}/${frontMatter.slug}.md`;

  return (
    <BaseLayout sourceUrl={sourceUrl}>
      <PostLayout frontMatter={frontMatter} prev={prev} next={next}>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </PostLayout>
    </BaseLayout>
  );
};
