import { IndexPosts } from '../../components/pages/IndexPosts'
import { BlogContextProvider } from '../../components/BlogContextProvider'
import { getAllFilesFrontMatter } from '../../lib/mdx'
import websiteJson from '../../website.json'

export async function generateStaticParams() {
  const languages = Object.keys(websiteJson.languages).filter(l => l !== 'default')
  return languages.map(language => ({ language }))
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
