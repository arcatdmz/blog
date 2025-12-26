import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { TaggedPosts } from '../../../../components/pages/TaggedPosts'
import { BlogContextProvider } from '../../../../components/BlogContextProvider'
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

export async function generateMetadata({ params }: { params: { language: string; tag: string } }): Promise<Metadata> {
  const langConfig = websiteJson.languages[params.language] || websiteJson.languages.default
  const { siteUrl, locale, author, title, description, bannerUrl } = langConfig
  const url = `${siteUrl}tags/${params.tag}/`
  const tagTitle = params.language === 'ja' 
    ? `タグ "${params.tag}" の投稿`
    : `Posts tagged with "${params.tag}"`
  
  return {
    title: tagTitle,
    description,
    authors: [{ name: author }],
    openGraph: {
      type: 'website',
      locale,
      url,
      title: tagTitle,
      description,
      ...(bannerUrl && {
        images: [
          {
            url: bannerUrl,
            alt: title,
            width: 1200,
            height: 600
          }
        ]
      })
    }
  }
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
    <BlogContextProvider language={language}>
      <TaggedPosts posts={posts} tag={tag} />
    </BlogContextProvider>
  )
}
