import { FC } from "react";
import { Container, Header, Segment } from "semantic-ui-react";

const NotFoundLayout: FC = () => (
  <Container id="main">
    <Header as="h1">404 Not Found</Header>
    <Segment content="記事が見つかりませんでした。" />
  </Container>
);

export { NotFoundLayout };
