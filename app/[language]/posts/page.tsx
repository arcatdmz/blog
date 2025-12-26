import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { Posts } from '../../../components/pages/Posts'
import { BlogContextProvider } from '../../../components/BlogContextProvider'
import { getAllFilesFrontMatter } from '../../../lib/mdx'
import { generateRss } from '../../../lib/generate-rss'
import websiteJson from '../../../website.json'

const root = process.cwd()

export async function generateStaticParams() {
  const languages = Object.keys(websiteJson.languages).filter(l => l !== 'default')
  return languages.map(language => ({ language }))
}

export async function generateMetadata({ params }: { params: { language: string } }): Promise<Metadata> {
  const langConfig = websiteJson.languages[params.language] || websiteJson.languages.default
  const { siteUrl, locale, author, title, description, bannerUrl } = langConfig
  const url = `${siteUrl}posts/`
  const postsTitle = params.language === 'ja' ? '日本語の投稿' : 'English posts'
  
  return {
    title: postsTitle,
    description,
    authors: [{ name: author }],
    openGraph: {
      type: 'website',
      locale,
      url,
      title: postsTitle,
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

export default async function PostsPage({ params }: { params: { language: string } }) {
  const posts = await getAllFilesFrontMatter(params.language)
  const rss = generateRss(posts, { path: `/${params.language}/index.xml` })
  const rssPath = path.join(root, 'public', params.language)
  fs.mkdirSync(rssPath, { recursive: true })
  fs.writeFileSync(path.join(rssPath, 'index.xml'), rss)
  return (
    <BlogContextProvider language={params.language}>
      <Posts posts={posts} />
    </BlogContextProvider>
  )
}
