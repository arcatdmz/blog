import { FC } from "react";
import { Container, Divider, List, Segment } from "semantic-ui-react";

const Footer: FC = () => (
  <Segment as="footer" basic textAlign="center">
    <Container>
      <Divider />
      <List horizontal divided>
        <List.Item>
          ©{" "}
          <a href="/#contact" className="typesquare_tags">
            Jun Kato
          </a>
        </List.Item>
        <List.Item>2012-{new Date().getFullYear()}</List.Item>
        <List.Item>
          <a href="/privacy" className="typesquare_tags">
            <i className="envelope open outline icon"></i> Privacy Policy
          </a>
        </List.Item>
        <List.Item>
          <a className="item typesquare_tags" href="/ja/">
            <i className="translate icon"></i> 日本語
          </a>
        </List.Item>
      </List>
    </Container>
  </Segment>
);

export default Footer;
