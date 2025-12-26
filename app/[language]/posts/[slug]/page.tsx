import { Metadata } from 'next'
import { Post } from '../../../../components/pages/Post'
import { BlogContextProvider } from '../../../../components/BlogContextProvider'
import websiteJson from '../../../../website.json'
import { getFiles, getFileBySlug, getAllFilesFrontMatter, formatSlug } from '../../../../lib/mdx'

export async function generateStaticParams() {
  const languages = Object.keys(websiteJson.languages).filter(l => l !== 'default')
  const paths: { language: string; slug: string }[] = []
  await Promise.all(
    languages.map(async language => {
      const posts = await getFiles(language)
      posts.forEach(post =>
        paths.push({ language, slug: formatSlug(post) })
      )
    })
  )
  return paths
}

export async function generateMetadata({ params }: { params: { language: string; slug: string } }): Promise<Metadata> {
  const post = await getFileBySlug(params.slug, params.language)
  const { title, summary, date, tags } = post.frontMatter
  const langConfig = websiteJson.languages[params.language] || websiteJson.languages.default
  const { siteUrl, locale, author, bannerUrl } = langConfig
  const url = `${siteUrl}posts/${params.slug}/`
  
  return {
    title,
    description: summary || langConfig.description,
    authors: [{ name: author }],
    openGraph: {
      type: 'article',
      locale,
      url,
      title,
      description: summary || langConfig.description,
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

export default async function PostPage({ params }: { params: { language: string; slug: string } }) {
  const allPosts = await getAllFilesFrontMatter(params.language)
  const postIndex = allPosts.findIndex(post => post.slug === params.slug)
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getFileBySlug(params.slug, params.language)
  return (
    <BlogContextProvider language={params.language}>
      <Post 
        post={post} 
        prev={prev} 
        next={next} 
        language={params.language}
        sourceRoot={websiteJson.sourceRoot}
      />
    </BlogContextProvider>
  )
}
