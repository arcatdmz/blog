import fs from 'fs'
import path from 'path'
import { TaggedPosts } from '../../../components/pages/TaggedPosts'
import { generateRss } from '../../../lib/generate-rss'
import { getAllFilesFrontMatter } from '../../../lib/mdx'
import { getAllTags } from '../../../lib/tags'
import { kebabCase } from '../../../lib/utils'

const root = process.cwd()

export async function generateStaticParams() {
  const tags = await getAllTags()
  return Object.keys(tags).map(tag => ({ tag }))
}

export default async function Tag({ params }: { params: { tag: string } }) {
  const tag = params.tag
  const posts = (await getAllFilesFrontMatter()).filter(
    post =>
      post.draft !== true &&
      post.tags &&
      post.tags.map(t => kebabCase(t)).includes(tag)
  )
  const rss = generateRss(posts, { path: `tags/${tag}/index.xml` })
  const rssPath = path.join(root, 'public', 'tags', tag)
  fs.mkdirSync(rssPath, { recursive: true })
  fs.writeFileSync(path.join(rssPath, 'index.xml'), rss)
  return <TaggedPosts posts={posts} tag={tag} />
}
