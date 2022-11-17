import fs from "fs";
import path from "path";

const articles = JSON.parse(fs.readFileSync("old-articles.json")).map(
  ({ file, url }) => {
    return {
      new: file.substring(0, file.length - ".md".length),
      old: url.substring(
        "https://junkato.jp/ja/blog/".length,
        url.length - "/".length
      )
    };
  }
);

fs.writeFileSync(
  "public/redirections.json",
  JSON.stringify(articles, null, "  ")
);
