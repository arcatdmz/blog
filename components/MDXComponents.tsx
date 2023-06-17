import { DetailedHTMLProps, FC, ImgHTMLAttributes } from "react";
import { Divider, Image } from "semantic-ui-react";

import { CustomLink } from "./CustomLink";

const MDXComponents = {
  /* this doesn't work in some cases */
  img: (props => (
    <Image {...props} fluid />
  )) /* <img {...props} className="ui fluid image" /> */ as FC<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
  >,

  a: CustomLink,
  hr: Divider
};

export { MDXComponents };
