import Link from "next/link";
import { useContext } from "react";
import { BlogContext } from "../lib/BlogContext";

import { kebabCase } from "../lib/utils";

const Tag = ({ text }) => {
  const { sitePath } = useContext(BlogContext);
  const href = `${sitePath}tags/${kebabCase(text)}`;
  return (
    <Link href={href}>
      <a href={href}>{text.split(" ").join("-")}</a>
    </Link>
  );
};

export { Tag };
