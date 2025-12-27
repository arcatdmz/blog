import { FC } from "react";
import { Container, Header, Segment } from "semantic-ui-react";

interface NotFoundLayoutProps {
  language?: string;
}

export const NotFoundLayout: FC<NotFoundLayoutProps> = ({ language }) => {
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
