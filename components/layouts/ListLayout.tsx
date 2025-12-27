"use client";

import {
  ChangeEvent,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import { Container, Form, Header, Segment } from "semantic-ui-react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";
import { ListItem } from "../ListItem";

interface ListLayoutProps {
  children?: ReactNode;
  posts: PostIface[];
  title?: string;
  header?: ReactNode;
  searchEnabled?: boolean;
}

const ListLayout: FC<ListLayoutProps> = ({
  children,
  posts,
  title,
  header,
  searchEnabled = true
}) => {
  const { language } = useContext(BlogContext);
  const [searchValue, setSearchValue] = useState("");

  const filteredPosts = useMemo<PostIface[]>(() => {
    const value = searchValue.toLowerCase();
    return posts.filter(frontMatter =>
      [
        frontMatter.title,
        frontMatter.summary || frontMatter.summary_generated,
        frontMatter.tags ? frontMatter.tags.join(" ") : "",
        frontMatter.slug.split("-").join(" ")
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [posts, searchValue]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  return (
    <Container id="main">
      {header || <Header as="h1">{title}</Header>}
      {searchEnabled && (
        <Form>
          <Form.Input
            type="text"
            onChange={handleChange}
            icon="search"
            placeholder={
              language === "ja"
                ? "検索キーワードを入力"
                : "Input search keywords"
            }
          />
        </Form>
      )}
      {!filteredPosts.length && (
        <Segment
          content={
            language === "ja"
              ? "記事が見つかりませんでした。"
              : "No posts found."
          }
        />
      )}
      {filteredPosts.map(frontMatter => {
        return <ListItem {...frontMatter} key={frontMatter.slug} />;
      })}
      {children}
    </Container>
  );
};

export { ListLayout };
