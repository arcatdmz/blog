import path from "path";

const root = process.cwd();

const config = [
  {
    dir: path.join(root, "src", "ja"),
    summaryLength: 140
  },
  {
    dir: path.join(root, "src", "default"),
    summaryLength: 70
  }
];

export default config;
