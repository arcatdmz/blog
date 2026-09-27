import fs from "fs";
import matter from "gray-matter";
import path from "path";

import config from "./config.mjs";
import { generateSummary } from "../editor/shared/summary.mjs";

const readFiles = async ({ language, dir, summaryLength }) => {
  const files = fs.readdirSync(dir);
  return Promise.all(
    files.map(async file => {
      const source = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(source);
      let updated = false;
      try {
        const summary_generated = generateSummary(
          content,
          language,
          summaryLength
        );
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
