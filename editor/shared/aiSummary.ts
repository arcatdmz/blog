export const DEFAULT_SUMMARY_MODEL = "gpt-5.4-mini";
export const defaultSummaryPrompt = (language: string) =>
  language === "ja"
    ? "記事の内容だけを根拠に、ブログ一覧に表示する日本語の概要を140字程度で書いてください。主題と具体的な内容を自然な文章で伝え、事実を補わず、見出しや前置き、引用符、Markdownを付けず概要だけを返してください。"
    : "Write a concise English summary for a blog listing, around 200 characters. Convey the main topic and concrete content using only facts in the article. Return only the summary, without headings, preambles, quotation marks, or Markdown.";
export interface SummaryInput {
  title: string;
  body: string;
  prompt: string;
}
export interface SummaryResult {
  summary: string;
  model: string;
}
export interface SummaryConfig {
  model: string;
  configured: boolean;
}
