import fs from 'fs'
import path from 'path'
import { TaggedPosts } from '../../../../components/pages/TaggedPosts'
import { BlogContext } from '../../../../lib/BlogContext'
import { generateRss } from '../../../../lib/generate-rss'
import { getAllFilesFrontMatter } from '../../../../lib/mdx'
import { getAllTags } from '../../../../lib/tags'
import { kebabCase } from '../../../../lib/utils'
import websiteJson from '../../../../website.json'

const root = process.cwd()

export async function generateStaticParams() {
  const languages = Object.keys(websiteJson.languages).filter(l => l !== 'default')
  const paths: { language: string; tag: string }[] = []
  await Promise.all(
    languages.map(async language => {
      const tags = await getAllTags(language)
      Object.keys(tags).forEach(tag => paths.push({ language, tag }))
    })
  )
  return paths
}

export default async function Tag({ params }: { params: { language: string; tag: string } }) {
  const tag = params.tag
  const language = params.language
  const posts = (await getAllFilesFrontMatter(language)).filter(
    post =>
      post.draft !== true &&
      post.tags &&
      post.tags.map(t => kebabCase(t)).includes(tag)
  )
  const rss = generateRss(posts, { path: `tags/${tag}/index.xml`, language })
  const rssPath = path.join(root, 'public', language, 'tags', tag)
  fs.mkdirSync(rssPath, { recursive: true })
  fs.writeFileSync(path.join(rssPath, 'index.xml'), rss)
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
      <TaggedPosts posts={posts} tag={tag} />
    </BlogContext.Provider>
  )
}
