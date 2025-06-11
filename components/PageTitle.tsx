"use client"
import { FC, ReactNode } from "react";
import { Header } from "semantic-ui-react";

interface IProps {
  children?: ReactNode;
}

const PageTitle: FC<IProps> = ({ children }) => (
  <Header as="h1">{children}</Header>
);

export { PageTitle };
