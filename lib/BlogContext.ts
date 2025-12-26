"use client"
import { createContext } from "react";
import websiteJson from "../website.json";

const defaultContextValue = {
  rootPath: websiteJson.rootPath,
  imageRoot: websiteJson.imageRoot,
  sourceRoot: websiteJson.sourceRoot,
  maxPosts: websiteJson.maxPosts,
  language: "default",
  ...websiteJson.languages.default
};

const BlogContext = createContext(defaultContextValue);

export { BlogContext };
