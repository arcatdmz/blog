export interface FrontMatterIface {
  title: string;
  summary: string;
  summary_generated: string;
  date: string;
  lastmod: string;
  tags: string[];
  coverImage?: string;
  altUrl?: string;
  draft?: boolean;
  language?: "ja" | "en";
}
