import { FC } from "react";
import { Divider, Image } from "semantic-ui-react";

import { CustomLink } from "./CustomLink";

const MDXComponents = {
  img: (props => <Image {...props} fluid />) as FC<HTMLImageElement>,
  a: CustomLink,
  hr: Divider
};

export { MDXComponents };
