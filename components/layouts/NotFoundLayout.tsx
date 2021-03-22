import { FC, useContext } from "react";
import { Container, Header, Segment } from "semantic-ui-react";

import { BlogContext } from "../../lib/BlogContext";

const NotFoundLayout: FC = () => {
  const { language } = useContext(BlogContext);
  return (
    <Container id="main">
      <Header as="h1">404 Not Found</Header>
      <Segment
        content={
          language === "ja"
            ? "記事が見つかりませんでした。"
            : "The specified article was not found."
        }
      />
    </Container>
  );
};

export { NotFoundLayout };
