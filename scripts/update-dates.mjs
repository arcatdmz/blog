import fs from "fs";
import path from "path";
import matter from "gray-matter";
import renderToString from "next-mdx-remote/render-to-string.js";

import config from "./config.mjs";

const readFiles = async ({ dir, summaryLength }) => {
  const files = fs.readdirSync(dir);
  return Promise.all(
    files.map(async file => {
      const source = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(source);

      const parsed = /([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)\.md/.exec(file);
      const dateFromFileName = `${parsed[1]}-${parsed[2]}-${parsed[3]}`;
      if (data.date !== dateFromFileName) {
        data.date = dateFromFileName;
        const output = matter.stringify(content, data);
        fs.writeFileSync(path.join(dir, file), output);
        console.log(`Write: ${file}`);
      }
    })
  ).then(_results => {
    console.log(`Done: ${dir} (check dates)`);
  });
};

Promise.all(config.map(readFiles));
