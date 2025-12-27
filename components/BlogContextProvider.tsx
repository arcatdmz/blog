"use client";

import { ReactNode } from "react";

import { BlogContext } from "../lib/BlogContext";
import websiteJson from "../website.json";

interface BlogContextProviderProps {
  children: ReactNode;
  language: string;
}

export function BlogContextProvider({
  children,
  language
}: BlogContextProviderProps) {
  return (
    <BlogContext.Provider
      value={{
        language,
        rootPath: websiteJson.rootPath,
        imageRoot: websiteJson.imageRoot,
        sourceRoot: websiteJson.sourceRoot,
        maxPosts: websiteJson.maxPosts,
        ...websiteJson.languages[language]
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}
