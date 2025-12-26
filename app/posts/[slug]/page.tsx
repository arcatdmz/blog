import { Metadata } from 'next'
import { Post } from '../../../components/pages/Post'
import { BlogContextProvider } from '../../../components/BlogContextProvider'
import { getFiles, getFileBySlug, getAllFilesFrontMatter, formatSlug } from '../../../lib/mdx'
import websiteJson from '../../../website.json'

export async function generateStaticParams() {
  const posts = await getFiles()
  return posts.map(p => ({ slug: formatSlug(p) }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getFileBySlug(params.slug)
  const { title, summary, date, tags } = post.frontMatter
  const { siteUrl, locale, author, bannerUrl } = websiteJson.languages.default
  const url = `${siteUrl}posts/${params.slug}/`
  
  return {
    title,
    description: summary || websiteJson.languages.default.description,
    authors: [{ name: author }],
    openGraph: {
      type: 'article',
      locale,
      url,
      title,
      description: summary || websiteJson.languages.default.description,
      publishedTime: date,
      tags: tags || [],
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

export default async function PostPage({ params }: { params: { slug: string } }) {
  const allPosts = await getAllFilesFrontMatter()
  const postIndex = allPosts.findIndex(post => post.slug === params.slug)
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getFileBySlug(params.slug)
  return (
    <BlogContextProvider language="default">
      <Post 
        post={post} 
        prev={prev} 
        next={next} 
        language="default"
        sourceRoot={websiteJson.sourceRoot}
      />
    </BlogContextProvider>
  )
}
