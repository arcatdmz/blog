import fs from "fs";

const articles = JSON.parse(fs.readFileSync("old-articles.json")).map(
  ({ file, rename, url }) => {
    const current = rename || file;
    return {
      new: current.substring(0, current.length - ".md".length),
      old: url.substring(
        "https://junkato.jp/ja/blog/".length,
        url.length - "/".length
      )
    };
  }
);

const categories = JSON.parse(fs.readFileSync("old-categories.json"));

fs.writeFileSync(
  "public/redirections.json",
  JSON.stringify({ articles, categories }, null, "  ")
);
