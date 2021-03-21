import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Container, Form, Header, List, Segment } from "semantic-ui-react";
import ListItem from "./ListItem";

export default function ListLayout({ posts, title }) {
  const [searchValue, setSearchValue] = useState("");

  const filteredBlogPosts = useMemo(() => {
    const value = searchValue.toLowerCase();
    return posts.filter((frontMatter) =>
      (frontMatter.title + frontMatter.summary + frontMatter.tags.join(" "))
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
      <Form>
        <Form.Input type="text" onChange={handleChange} icon="search" />
      </Form>
      <Segment>
      <List divided relaxed>
        {!filteredBlogPosts.length && <List.Item content="No posts found." />}
        {filteredBlogPosts.map((frontMatter) => {
          return (
            <ListItem {...frontMatter} key={frontMatter.slug} />
          );
        })}
      </List>
      </Segment>
    </Container>
  );
}
