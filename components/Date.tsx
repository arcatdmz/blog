"use client";

import { FC, useContext } from "react";

import { BlogContext } from "../lib/BlogContext";

interface DateProps {
  value: string | number;
}

const DateComponent: FC<DateProps> = ({ value }) => {
  const { locale } = useContext(BlogContext);
  return (
    <time dateTime={String(value)}>
      {new Date(value).toLocaleDateString(locale, {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric"
      })}
    </time>
  );
};

export { DateComponent as Date };
