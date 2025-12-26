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
  const [error, setError] = useState<Error | null>(null);
  const sourceUrl = `${sourceRoot}${language}/${frontMatter.slug}.md`;
  
  useEffect(() => {
    // Run the compiled MDX on the client side
    run(mdxSource, {
      ...runtime,
      baseUrl: import.meta.url
    }).then((mdxModule: any) => {
      setMDXContent(() => mdxModule.default);
    }).catch((err: Error) => {
      console.error('Error running MDX:', err);
      setError(err);
    });
  }, [mdxSource]);
  
  if (error) {
    return (
      <BaseLayout sourceUrl={sourceUrl}>
        <PostLayout frontMatter={frontMatter} prev={prev} next={next}>
          <div>Error loading content: {error.message}</div>
        </PostLayout>
      </BaseLayout>
    );
  }
  
  return (
    <BaseLayout sourceUrl={sourceUrl}>
      <PostLayout frontMatter={frontMatter} prev={prev} next={next}>
        {MDXContent ? <MDXContent components={MDXComponents} /> : <div>Loading...</div>}
      </PostLayout>
    </BaseLayout>
  );
};
