"use client"
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { FC, useContext } from "react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";

import { MDXComponents } from "../MDXComponents";
import { BaseLayout } from "../layouts/BaseLayout";
import { PostLayout } from "../layouts/PostLayout";

export interface PostProps {
  post: {
    mdxSource: MDXRemoteSerializeResult;
    frontMatter: PostIface;
  };
  prev?: PostIface;
  next?: PostIface;
}

export const Post: FC<PostProps> = ({ post, prev, next }) => {
  const { language, sourceRoot } = useContext(BlogContext);
  const { mdxSource, frontMatter } = post;
  const sourceUrl = `${sourceRoot}${language}/${frontMatter.slug}.md`;
  return (
    <BaseLayout sourceUrl={sourceUrl}>
      <PostLayout frontMatter={frontMatter} prev={prev} next={next}>
        <MDXRemote {...mdxSource} components={MDXComponents} />
      </PostLayout>
    </BaseLayout>
  );
};
