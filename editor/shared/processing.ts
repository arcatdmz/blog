import { format } from "prettier/standalone";
import * as markdown from "prettier/plugins/markdown";
import * as yaml from "prettier/plugins/yaml";
import * as html from "prettier/plugins/html";
import * as babel from "prettier/plugins/babel";
import * as estree from "prettier/plugins/estree";
import * as typescript from "prettier/plugins/typescript";
import * as postcss from "prettier/plugins/postcss";
import { generateSummary } from "./summary.mjs";
import { splitDocument, updateMetadata } from "./document";

export async function processPost(
  source: string,
  path: string
): Promise<string> {
  const options = {
    parser: path.endsWith(".mdx") ? "mdx" : "markdown",
    plugins: [markdown, yaml, html, babel, estree, typescript, postcss],
    trailingComma: "none" as const,
    arrowParens: "avoid" as const,
    singleQuote: false
  };
  const formatted = await format(source, options);
  const { body } = splitDocument(formatted);
  return format(
    updateMetadata(formatted, {
      summary_generated: generateSummary(body, path.split("/")[1])
    }),
    options
  );
}
