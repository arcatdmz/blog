import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { FrontMatterIface } from "./FrontMatterIface";
import { kebabCase } from "./utils";

const root = process.cwd();

interface TagCountIface {
  [key: string]: number;
}

export async function getAllTags(language: string = "default") {
  const files = fs.readdirSync(path.join(root, "src", language));

  let tagCount: TagCountIface = {};
  // Iterate through each post, putting all found tags into `tags`
  files.forEach(file => {
    const source = fs.readFileSync(
      path.join(root, "src", language, file),
      "utf8"
    );
    const data = matter(source).data as FrontMatterIface;
    if (data.tags && data.draft !== true) {
      data.tags.forEach(tag => {
        const formattedTag = kebabCase(tag);
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1;
        } else {
          tagCount[formattedTag] = 1;
        }
      });
    }
  });

  return tagCount;
}
