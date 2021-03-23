import fs from "fs";
import path from "path";

import config from "./config.mjs";

const articles = JSON.parse(fs.readFileSync("old-articles.json")).filter(
  article => !!article.rename
);

const moveFiles = async ({ dir }) => {
  for (const article of articles) {
    const from = path.join(dir, article.file);
    const to = path.join(dir, article.rename);
    fs.renameSync(from, to);
  }
  console.log("Done");
};

Promise.all(config.filter(c => c.language === "ja").map(moveFiles));
