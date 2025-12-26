import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { Posts } from '../../components/pages/Posts'
import { BlogContextProvider } from '../../components/BlogContextProvider'
import { getAllFilesFrontMatter } from '../../lib/mdx'
import { generateRss } from '../../lib/generate-rss'
import websiteJson from '../../website.json'

const root = process.cwd()

export const metadata: Metadata = {
  title: 'English posts',
  description: websiteJson.languages.default.description,
  authors: [{ name: websiteJson.languages.default.author }],
  openGraph: {
    type: 'website',
    locale: websiteJson.languages.default.locale,
    url: `${websiteJson.languages.default.siteUrl}posts/`,
    title: 'English posts',
    description: websiteJson.languages.default.description
  }
}

export default async function PostsPage() {
  const posts = await getAllFilesFrontMatter()
  const rssPath = path.join(root, 'public', 'index.xml')
  const rss = generateRss(posts)
  fs.writeFileSync(rssPath, rss)
  return (
    <BlogContextProvider language="default">
      <Posts posts={posts} />
    </BlogContextProvider>
  )
}
