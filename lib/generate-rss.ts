import websiteJson from "../website.json";

import { PostIface } from "./PostIface";

const generateRssItem = (post: PostIface) => `
  <item>
    <guid>${websiteJson.siteUrl}/posts/${post.slug}</guid>
    <title>${post.title}</title>
    <link>${websiteJson.siteUrl}/posts/${post.slug}</link>
    <description>${post.summary}</description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${websiteJson.email} (${websiteJson.author})</author>
    ${post.tags.map(t => `<category>${t}</category>`).join("")}
  </item>
`;

const generateRss = (posts: PostIface[], page = "index.xml") => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${websiteJson.title}</title>
      <link>${websiteJson.siteUrl}</link>
      <description>${websiteJson.description}</description>
      <language>${websiteJson.language}</language>
      <managingEditor>${websiteJson.email} (${
  websiteJson.author
})</managingEditor>
      <webMaster>${websiteJson.email} (${websiteJson.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${
        websiteJson.siteUrl
      }/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join("")}
    </channel>
  </rss>
`;

export { generateRss };
