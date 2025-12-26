import { BlogContextProvider } from '../components/BlogContextProvider'
import { IndexPosts } from '../components/pages/IndexPosts'
import websiteJson from '../website.json'
import { getAllFilesFrontMatter } from '../lib/mdx'

export default async function Page() {
  const posts = await getAllFilesFrontMatter()
  const filteredPosts = posts && posts.slice(0, websiteJson.maxPosts)
  return (
    <BlogContextProvider language="default">
      <IndexPosts posts={filteredPosts} />
    </BlogContextProvider>
  )
}
