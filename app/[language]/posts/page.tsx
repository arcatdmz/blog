import fs from 'fs'
import path from 'path'
import { Posts } from '../../../components/pages/Posts'
import { getAllFilesFrontMatter } from '../../../lib/mdx'
import { generateRss } from '../../../lib/generate-rss'
import websiteJson from '../../../website.json'

const root = process.cwd()

export async function generateStaticParams() {
  const languages = Object.keys(websiteJson.languages).filter(l => l !== 'default')
  return languages.map(language => ({ language }))
}

export default async function PostsPage({ params }: { params: { language: string } }) {
  const posts = await getAllFilesFrontMatter(params.language)
  const rss = generateRss(posts, { path: `/${params.language}/index.xml` })
  const rssPath = path.join(root, 'public', params.language)
  fs.mkdirSync(rssPath, { recursive: true })
  fs.writeFileSync(path.join(rssPath, 'index.xml'), rss)
  return <Posts posts={posts} />
}
