import hydrate from "next-mdx-remote/hydrate";
import { MdxRemote } from "next-mdx-remote/types";
import { FC, useContext } from "react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";

import { MDXComponents } from "../MDXComponents";
import { BaseLayout } from "../layouts/BaseLayout";
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
  const { language } = useContext(BlogContext);
  const { mdxSource, frontMatter } = post;
  const content = hydrate(mdxSource, {
    components: MDXComponents
  });
  const sourceUrl = `https://github.com/arcatdmz/blog/blob/main/src/${language}/${frontMatter.slug}.md`;
  return (
    <BaseLayout sourceUrl={sourceUrl}>
      <PostLayout frontMatter={frontMatter} prev={prev} next={next}>
        {content}
      </PostLayout>
    </BaseLayout>
  );
};
