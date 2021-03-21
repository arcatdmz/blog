import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { Divider, Icon, Menu } from "semantic-ui-react";

import { ListLayout } from "../components/ListLayout";
import { PageSeo } from "../components/SEO";
import { getAllFilesFrontMatter } from "../lib/mdx";
import { PostIface } from "../lib/PostIface";

import websiteJson from "../website.json";

const MAX_DISPLAY = 5;

interface PageProps {
  posts: PostIface[];
}

const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const posts = await getAllFilesFrontMatter();
  return { props: { posts } };
};

const Home: NextPage<PageProps> = ({ posts }) => {
  const filteredPosts = posts && posts.slice(0, MAX_DISPLAY);

  return (
    <>
      <PageSeo
        title={websiteJson.title}
        description={websiteJson.description}
        url={websiteJson.siteUrl}
      />
      <ListLayout
        posts={filteredPosts}
        title={`最新の投稿 ${MAX_DISPLAY} 件`}
        searchEnabled={false}
      >
        {posts.length > MAX_DISPLAY && (
          <>
            <Divider />
            <footer>
              <Menu stackable>
                <Link href="/posts">
                  <Menu.Item as="a" href="/posts" position="right">
                    <Icon name="angle down" />
                    すべての投稿を見る
                  </Menu.Item>
                </Link>
              </Menu>
            </footer>
          </>
        )}
      </ListLayout>
    </>
  );
};

export { getStaticProps };
export default Home;
