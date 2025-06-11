import { IndexPosts } from '../../components/pages/IndexPosts'
import { BlogContext } from '../../lib/BlogContext'
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
    <BlogContext.Provider
      value={{
        language: params.language,
        rootPath: websiteJson.rootPath,
        imageRoot: websiteJson.imageRoot,
        sourceRoot: websiteJson.sourceRoot,
        maxPosts: websiteJson.maxPosts,
        ...websiteJson.languages[params.language]
      }}
    >
      <IndexPosts posts={filteredPosts} />
    </BlogContext.Provider>
  )
}
