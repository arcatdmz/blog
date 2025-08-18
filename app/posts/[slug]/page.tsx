import { Post } from '../../../components/pages/Post'
import { getFiles, getFileBySlug, getAllFilesFrontMatter, formatSlug } from '../../../lib/mdx'

export async function generateStaticParams() {
  const posts = await getFiles()
  return posts.map(p => ({ slug: formatSlug(p) }))
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const allPosts = await getAllFilesFrontMatter()
  const postIndex = allPosts.findIndex(post => post.slug === params.slug)
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getFileBySlug(params.slug)
  return <Post post={post} prev={prev} next={next} />
}
