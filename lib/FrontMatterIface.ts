export interface FrontMatterIface {
  title: string;
  summary: string;
  date: string;
  lastmod: string;
  tags: string[];
  coverImage?: string;
  draft?: boolean;
  language?: "ja" | "en";
}
