"use client"
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";

import { PostIface } from "../../lib/PostIface";

import { MDXComponents } from "../MDXComponents";
import { BaseLayout } from "../layouts/BaseLayout";
import { PostLayout } from "../layouts/PostLayout";

export interface PostProps {
  post: {
    mdxSource: string;
    frontMatter: PostIface;
  };
  prev?: PostIface;
  next?: PostIface;
  language: string;
  sourceRoot: string;
}

export const Post = ({ post, prev, next, language, sourceRoot }: PostProps) => {
  const { mdxSource, frontMatter } = post;
  const MDXContent = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  const sourceUrl = `${sourceRoot}${language}/${frontMatter.slug}.md`;
  
  return (
    <BaseLayout sourceUrl={sourceUrl}>
      <PostLayout frontMatter={frontMatter} prev={prev} next={next}>
        <MDXContent components={MDXComponents} />
      </PostLayout>
    </BaseLayout>
  );
};
