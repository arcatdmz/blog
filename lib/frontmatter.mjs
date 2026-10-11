import { isMap, parseDocument, stringify } from "yaml";

// Keep YAML timestamp values compatible with the former gray-matter parser.
const yamlOptions = { customTags: ["timestamp"] };

export default function matter(source) {
  const match =
    /^(?:\uFEFF)?---[ \t]*\r?\n([\s\S]*?)^---[ \t]*(?:\r?\n|$)/m.exec(source);
  if (!match || match.index !== 0) {
    if (/^(?:\uFEFF)?---[ \t]*\r?\n/.test(source)) {
      throw new Error("Unclosed YAML frontmatter");
    }
    return { data: {}, content: source };
  }
  const document = parseDocument(match[1], yamlOptions);
  if (document.errors.length) throw document.errors[0];
  if (document.contents !== null && !isMap(document.contents)) {
    throw new Error("Frontmatter must be a YAML mapping");
  }
  return {
    data: document.toJS({ maxAliasCount: 50 }) ?? {},
    content: source.slice(match[0].length)
  };
}

matter.stringify = (content, data) =>
  `---\n${stringify(data, { ...yamlOptions, lineWidth: 0 })}---\n${content}`;
