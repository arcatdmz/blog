import Head from "next/head";
import { FC, useContext } from "react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";

import { PageSeo } from "../SEO";
import { BaseLayout } from "../layouts/BaseLayout";
import { ListLayout } from "../layouts/ListLayout";

interface PostsProps {
  posts: PostIface[];
  tag: string;
}

const TaggedPosts: FC<PostsProps> = ({ posts, tag }) => {
  const blog = useContext(BlogContext);
  const text =
    blog.language === "ja" ? "タグ付けされた投稿: " : "Posts tagged with ";

  return (
    <BaseLayout>
      <Head>
        <link
          key="rss"
          rel="alternate"
          type="application/rss+xml"
          href={`${blog.sitePath}tags/${tag}/index.xml`}
        />
      </Head>
      <PageSeo
        title={`${text}"${tag}" | ${blog.title}`}
        description={blog.description}
        url={blog.siteUrl}
      />
      <ListLayout posts={posts} title={`${text}"${tag}"`} />
    </BaseLayout>
  );
};

export { TaggedPosts };
