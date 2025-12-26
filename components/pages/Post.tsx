"use client"
import { useEffect, useState } from "react";
import { run } from "@mdx-js/mdx";
import * as runtime from 'react/jsx-runtime';

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
  const [MDXContent, setMDXContent] = useState<React.ComponentType<any> | null>(null);
  const sourceUrl = `${sourceRoot}${language}/${frontMatter.slug}.md`;
  
  useEffect(() => {
    // Run the compiled MDX on the client side
    run(mdxSource, runtime as any).then((mdxModule: any) => {
      setMDXContent(() => mdxModule.default);
    });
  }, [mdxSource]);
  
  return (
    <BaseLayout sourceUrl={sourceUrl}>
      <PostLayout frontMatter={frontMatter} prev={prev} next={next}>
        {MDXContent && <MDXContent components={MDXComponents} />}
      </PostLayout>
    </BaseLayout>
  );
};
