import { FC } from "react";
import { Container, Divider, List, Segment } from "semantic-ui-react";

const Footer: FC = () => (
  <Segment as="footer" basic textAlign="center">
    <Container>
      <Divider />
      <List horizontal divided>
        <List.Item>
          © <a href="//junkato.jp/ja/#contact">加藤 淳</a>
        </List.Item>
        <List.Item>2012-{new Date().getFullYear()}</List.Item>
        <List.Item as="a" href="//junkato.jp/ja/privacy">
          <i className="envelope open outline icon"></i> プライバシーポリシー
        </List.Item>
        <List.Item as="a" href="//junkato.jp">
          <i className="translate icon"></i> English
        </List.Item>
      </List>
    </Container>
  </Segment>
);

export { Footer };
