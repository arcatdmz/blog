import { Metadata } from 'next'
import { IndexPosts } from '../../components/pages/IndexPosts'
import { BlogContextProvider } from '../../components/BlogContextProvider'
import { getAllFilesFrontMatter } from '../../lib/mdx'
import websiteJson from '../../website.json'

export async function generateStaticParams() {
  const languages = Object.keys(websiteJson.languages).filter(l => l !== 'default')
  return languages.map(language => ({ language }))
}

export async function generateMetadata({ params }: { params: { language: string } }): Promise<Metadata> {
  const langConfig = websiteJson.languages[params.language] || websiteJson.languages.default
  const { siteUrl, locale, author, title, description, bannerUrl } = langConfig
  
  return {
    title,
    description,
    authors: [{ name: author }],
    openGraph: {
      type: 'website',
      locale,
      url: siteUrl,
      title,
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

export default async function LangHome({ params }: { params: { language: string } }) {
  const posts = await getAllFilesFrontMatter(params.language)
  const filteredPosts = posts && posts.slice(0, websiteJson.maxPosts)
  return (
    <BlogContextProvider language={params.language}>
      <IndexPosts posts={filteredPosts} />
    </BlogContextProvider>
  )
}
