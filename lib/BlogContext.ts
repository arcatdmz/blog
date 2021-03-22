import { createContext } from "react";

const BlogContext = createContext<{
  rootPath: string;
  imageRoot: string;
  maxPosts: number;
  language: string;
  bannerUrl: string;
  siteUrl: string;
  sitePath: string;
  locale: string;
  title: string;
  author: string;
  authorUrl: string;
  email: string;
  description: string;
}>(null);

export { BlogContext };
