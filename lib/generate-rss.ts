import websiteJson from "../website.json";

import { PostIface } from "./PostIface";

const generateRssItem = (post: PostIface, language: string) => `
  <item>
    <guid>${websiteJson.languages[language].siteUrl}posts/${post.slug}/</guid>
    <title>${post.title}</title>
    <link>${websiteJson.languages[language].siteUrl}posts/${post.slug}/</link>
    <description>${post.summary || post.summary_generated}</description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${websiteJson.languages[language].email} (${
  websiteJson.languages[language].author
})</author>
    ${post.tags ? post.tags.map(t => `<category>${t}</category>`).join("") : ""}
  </item>
`;

interface RssOptions {
  path?: string;
  language?: string;
}

const generateRss = (
  posts: PostIface[],
  { path, language }: RssOptions = {}
) => {
  if (!path) {
    path = "index.xml";
  }
  if (!language) {
    language = "default";
  }
  return `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${websiteJson.languages[language].title}</title>
      <link>${websiteJson.languages[language].siteUrl}</link>
      <description>${websiteJson.languages[language].description}</description>
      <language>${websiteJson.languages[language].locale}</language>
      <managingEditor>${websiteJson.languages[language].email} (${
    websiteJson.languages[language].author
  })</managingEditor>
      <webMaster>${websiteJson.languages[language].email} (${
    websiteJson.languages[language].author
  })</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${
        websiteJson.languages[language].siteUrl
      }${path}" rel="self" type="application/rss+xml"/>
      ${posts.map(post => generateRssItem(post, language)).join("")}
    </channel>
  </rss>
`;
};

export { generateRss };
