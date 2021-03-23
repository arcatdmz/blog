import path from "path";

const root = process.cwd();

const config = [
  {
    language: "ja",
    dir: path.join(root, "src", "ja"),
    summaryLength: 140
  },
  {
    language: "default",
    dir: path.join(root, "src", "default"),
    summaryLength: 70
  }
];

export default config;
