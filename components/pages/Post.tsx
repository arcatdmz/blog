import hydrate from "next-mdx-remote/hydrate";
import { MdxRemote } from "next-mdx-remote/types";
import { FC } from "react";

import { PostIface } from "../../lib/PostIface";

import { MDXComponents } from "../MDXComponents";
import { LayoutWrapper } from "../layouts/LayoutWrapper";
import { NotFoundLayout } from "../layouts/NotFoundLayout";
import { PostLayout } from "../layouts/PostLayout";

export interface PostProps {
  post: {
    mdxSource: MdxRemote.Source;
    frontMatter: PostIface;
  };
  prev?: PostIface;
  next?: PostIface;
}

export const Post: FC<PostProps> = ({ post, prev, next }) => {
  const { mdxSource, frontMatter } = post;
  const content = hydrate(mdxSource, {
    components: MDXComponents
  });
  return (
    <LayoutWrapper>
      {frontMatter.draft !== true ? (
        <PostLayout frontMatter={frontMatter} prev={prev} next={next}>
          {content}
        </PostLayout>
      ) : (
        <NotFoundLayout />
      )}
    </LayoutWrapper>
  );
};
