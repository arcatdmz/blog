import { FC } from "react";
import { Header } from "semantic-ui-react";

const PageTitle: FC = ({ children }) => <Header as="h1">{children}</Header>;

export { PageTitle };
