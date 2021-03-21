import Link from "next/link";

import { kebabCase } from "../lib/utils";

const Tag = ({ text }) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`}>{text.split(" ").join("-")}</Link>
  );
};

export { Tag };
