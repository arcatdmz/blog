import { Post } from '../../../../components/pages/Post'
import websiteJson from '../../../../website.json'
import { BlogContext } from '../../../../lib/BlogContext'
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

export default async function PostPage({ params }: { params: { language: string; slug: string } }) {
  const allPosts = await getAllFilesFrontMatter(params.language)
  const postIndex = allPosts.findIndex(post => post.slug === params.slug)
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getFileBySlug(params.slug, params.language)
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
      <Post post={post} prev={prev} next={next} />
    </BlogContext.Provider>
  )
}
