import Link from "next/link";
import { FC, useContext } from "react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";

import { PageSeo } from "../SEO";
import { BaseLayout } from "../layouts/BaseLayout";
import { ListLayout } from "../layouts/ListLayout";
import { Header } from "semantic-ui-react";

interface PostsProps {
  posts: PostIface[];
}

const Posts: FC<PostsProps> = ({ posts }) => {
  const { language, title, description, siteUrl } = useContext(BlogContext);
  const text = language === "ja" ? "日本語の投稿" : "English posts";
  return (
    <BaseLayout>
      <PageSeo
        title={`${text} | ${title}`}
        description={description}
        url={siteUrl}
      />
      <ListLayout
        posts={posts}
        header={
          <>
            <Header as="h1">{text}</Header>
            {language === "ja" ? (
              <p>
                これまでの全投稿です。{" "}
                <Link href="/posts">
                  <a href="/posts">Follow this link</a>
                </Link>{" "}
                to read English posts.
              </p>
            ) : (
              <p>
                This page shows all posts in English. 日本語の投稿は
                <Link href="/ja/posts">
                  <a href="/ja/posts">こちら</a>
                </Link>
                です。
              </p>
            )}
          </>
        }
      />
    </BaseLayout>
  );
};

export { Posts };
