import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const target = process.argv[2];
if (!["github", "cloudflare"].includes(target))
  throw new Error("Usage: npm run secrets:summary -- github|cloudflare");
const vars = parseEnv(
  readFileSync(new URL("../.dev.vars", import.meta.url), "utf8")
);
if (!vars.OPENAI_API_KEY?.trim())
  throw new Error("Set OPENAI_API_KEY in editor/.dev.vars first.");
const run = (command, args, input) => {
  const result = spawnSync(command, args, {
    input,
    stdio: ["pipe", "inherit", "inherit"],
    cwd: fileURLToPath(new URL("..", import.meta.url))
  });
  if (result.error || result.status !== 0)
    throw new Error("Secret configuration failed. Check CLI authentication.");
};
if (target === "github") {
  run(
    "gh",
    ["secret", "set", "OPENAI_API_KEY", "--repo", "arcatdmz/blog"],
    vars.OPENAI_API_KEY
  );
  run("gh", [
    "variable",
    "set",
    "OPENAI_SUMMARY_MODEL",
    "--repo",
    "arcatdmz/blog",
    "--body",
    vars.OPENAI_SUMMARY_MODEL?.trim() || "gpt-5.4-mini"
  ]);
} else {
  run(
    process.execPath,
    [
      "node_modules/wrangler/bin/wrangler.js",
      "secret",
      "put",
      "OPENAI_API_KEY"
    ],
    vars.OPENAI_API_KEY
  );
}
