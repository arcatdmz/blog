"use client"
import { DetailedHTMLProps, FC, ImgHTMLAttributes } from "react";
import { Divider, Image } from "semantic-ui-react";
// import { Components } from "@mdx-js/react/lib";

import { CustomLink } from "./CustomLink";

const components: /* Components */ any = {
  /* this doesn't work in some cases */
  img: (props => (
    <Image {...props} fluid />
  )) /* <img {...props} className="ui fluid image" /> */ as FC<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
  >,

  a: CustomLink,
  hr: Divider
};

export { components as MDXComponents };
