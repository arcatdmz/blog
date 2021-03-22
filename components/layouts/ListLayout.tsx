import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { Container, Form, Header, Segment } from "semantic-ui-react";

import { PostIface } from "../../lib/PostIface";

import { ListItem } from "../ListItem";

interface ListLayoutProps {
  posts: PostIface[];
  title: string;
  searchEnabled?: boolean;
}

const ListLayout: FC<ListLayoutProps> = ({
  posts,
  title,
  searchEnabled = true,
  children
}) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredPosts = useMemo<PostIface[]>(() => {
    const value = searchValue.toLowerCase();
    return posts.filter(frontMatter =>
      (
        frontMatter.title +
        (frontMatter.summary || "") +
        frontMatter.summary_generated +
        frontMatter.tags.join(" ")
      )
        .toLowerCase()
        .includes(value)
    );
  }, [searchValue]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  return (
    <Container id="main">
      <Header as="h1">{title}</Header>
      {searchEnabled && (
        <Form>
          <Form.Input type="text" onChange={handleChange} icon="search" />
        </Form>
      )}
      {!filteredPosts.length && (
        <Segment content="記事が見つかりませんでした。" />
      )}
      {filteredPosts.map(frontMatter => {
        return <ListItem {...frontMatter} key={frontMatter.slug} />;
      })}
      {children}
    </Container>
  );
};

export { ListLayout };
