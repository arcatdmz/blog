import fs from 'fs'
import path from 'path'
import { Posts } from '../../components/pages/Posts'
import { getAllFilesFrontMatter } from '../../lib/mdx'
import { generateRss } from '../../lib/generate-rss'

const root = process.cwd()

export default async function PostsPage() {
  const posts = await getAllFilesFrontMatter()
  const rssPath = path.join(root, 'public', 'index.xml')
  const rss = generateRss(posts)
  fs.writeFileSync(rssPath, rss)
  return <Posts posts={posts} />
}
