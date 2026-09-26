import { isMap, parseDocument } from "yaml";
import { MAX_POST_BYTES } from "./model";

export function splitDocument(source: string) {
  const match = /^(?:\uFEFF)?---\r?\n([\s\S]*?)^---[ \t]*(?:\r?\n|$)/m.exec(
    source
  );
  if (!match || match.index !== 0)
    throw new Error("The post needs YAML frontmatter between --- lines.");
  const yaml = parseDocument(match[1], {
    keepSourceTokens: true,
    uniqueKeys: true
  });
  if (yaml.errors.length || !isMap(yaml.contents))
    throw new Error(
      `Invalid frontmatter: ${yaml.errors[0]?.message || "expected a mapping"}`
    );
  const data = yaml.toJS({ maxAliasCount: 50 }) as Record<string, unknown>;
  return {
    header: match[0],
    body: source.slice(match[0].length),
    yaml,
    data,
    newline: source.includes("\r\n") ? "\r\n" : "\n"
  };
}

export function updateMetadata(
  source: string,
  updates: Record<string, unknown>
): string {
  const doc = splitDocument(source);
  let changed = false;
  for (const [key, value] of Object.entries(updates)) {
    if (JSON.stringify(doc.data[key]) === JSON.stringify(value)) continue;
    changed = true;
    if (value === undefined) doc.yaml.delete(key);
    else doc.yaml.set(key, value);
  }
  if (!changed) return source;
  const yaml = doc.yaml
    .toString({ lineWidth: 0 })
    .replace(/\r?\n/g, doc.newline);
  return `${source.startsWith("\uFEFF") ? "\uFEFF" : ""}---${doc.newline}${yaml}---${doc.newline}${doc.body}`;
}

export function validateDocument(source: string) {
  if (new TextEncoder().encode(source).length > MAX_POST_BYTES)
    throw new Error("Posts must be smaller than 512 KiB.");
  const { data } = splitDocument(source);
  if (typeof data.title !== "string" || !data.title.trim())
    throw new Error("A title is required.");
  const validDate = (value: unknown) =>
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value;
  if (!validDate(data.date))
    throw new Error("Date must be a valid YYYY-MM-DD date.");
  if (
    data.lastmod !== undefined &&
    data.lastmod !== "" &&
    !validDate(data.lastmod)
  )
    throw new Error("Last updated must be empty or a valid YYYY-MM-DD date.");
  for (const field of [
    "summary",
    "summary_generated",
    "coverImage",
    "altUrl"
  ]) {
    if (data[field] !== undefined && typeof data[field] !== "string")
      throw new Error(`${field} must be text.`);
  }
  if (
    data.tags !== undefined &&
    (!Array.isArray(data.tags) || data.tags.some(t => typeof t !== "string"))
  )
    throw new Error("Tags must be a list of strings.");
  if (data.draft !== undefined && typeof data.draft !== "boolean")
    throw new Error("Draft must be true or false.");
}

export function newDocument(title: string, date: string) {
  return updateMetadata(
    "---\ntitle: Untitled\ndate: '2000-01-01'\ntags: []\ndraft: true\n---\n\n",
    { title, date }
  );
}
