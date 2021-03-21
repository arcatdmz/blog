import { FC } from "react";

import websiteJson from "../website.json";

interface DateProps {
  value: string | number;
}

const DateComponent: FC<DateProps> = ({ value }) => (
  <time dateTime={String(value)}>
    {new Date(value).toLocaleDateString(websiteJson.locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })}
  </time>
);

export { DateComponent as Date };
