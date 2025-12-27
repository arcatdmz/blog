"use client";

import Link from "next/link";
import { FC, useContext } from "react";
import { Header } from "semantic-ui-react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";
import { BaseLayout } from "../layouts/BaseLayout";
import { ListLayout } from "../layouts/ListLayout";

interface PostsProps {
  posts: PostIface[];
}

const Posts: FC<PostsProps> = ({ posts }) => {
  const { language } = useContext(BlogContext);
  const text = language === "ja" ? "日本語の投稿" : "English posts";
  return (
    <BaseLayout>
      <ListLayout
        posts={posts}
        header={
          <>
            <Header as="h1">{text}</Header>
            {language === "ja" ? (
              <p>
                これまでの全投稿です。{" "}
                <Link href="/posts">Follow this link</Link> to read English
                posts.
              </p>
            ) : (
              <p>
                This page shows all posts in English. 日本語の投稿は
                <Link href="/ja/posts">こちら</Link>
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
