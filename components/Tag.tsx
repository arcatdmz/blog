import Link from "next/link";
import { useContext } from "react";
import { BlogContext } from "../lib/BlogContext";

import { kebabCase } from "../lib/utils";

const Tag = ({ text }) => {
  const { sitePath } = useContext(BlogContext);
  return (
    <Link href={`${sitePath}tags/${kebabCase(text)}`}>
      {text.split(" ").join("-")}
    </Link>
  );
};

export { Tag };
