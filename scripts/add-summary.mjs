import fs from "fs";
import path from "path";
import matter from "gray-matter";
import renderToString from "next-mdx-remote/render-to-string.js";
import HTML from "html-parse-stringify";

import config from "./config.mjs";

const toString = node => {
  if (node.type === "text") {
    return node.content;
  }
  if (!Array.isArray(node.children)) {
    return "";
  }
  return node.children.map(toString).join("");
};

const readFiles = async ({ dir, summaryLength }) => {
  const files = fs.readdirSync(dir);
  return Promise.all(
    files.map(async file => {
      const source = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(source);
      let text,
        updated = false;
      try {
        const ast = HTML.parse((await renderToString(content)).renderedOutput);
        const headerIndex = ast.findIndex(
          v => v.type === "tag" && /h[0-9]+/.test(v.name)
        );
        const intro = headerIndex > 0 ? ast.slice(0, headerIndex) : ast;
        text = intro.map(toString).join("");
        const summary_generated =
          text.length > summaryLength
            ? text.substr(0, summaryLength - 3) + "..."
            : text;
        if (data.summary_generated !== summary_generated) {
          data.summary_generated = summary_generated;
          const output = matter.stringify(content, data);
          fs.writeFileSync(path.join(dir, file), output);
          console.log(`Write: ${file}`);
          updated = true;
        }
      } catch (e) {
        console.error(`Parse failed: ${file}`);
      }
      return {
        file,
        title: data.title,
        updated,
        summary: data.summary,
        summary_generated: data.summary_generated
      };
    })
  ).then(_results => {
    // fs.writeFileSync(out, JSON.stringify(results, null, 2));
    console.log(`Done: ${dir} (${summaryLength}-bytes summary)`);
  });
};

Promise.all(config.map(readFiles));
