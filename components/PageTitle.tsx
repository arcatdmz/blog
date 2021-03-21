import { Header } from "semantic-ui-react";

export default function PageTitle({ children }) {
  return (
    <Header as="h1">
      {children}
    </Header>
  );
}
