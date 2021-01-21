import Layout from '../../components/layout'
import { getAllPostIds } from '../../lin/posts'

export default function Post() {
  return <Layout>...</Layout>
}

export async function getStaticPaths() {
	const paths = getAllPostIds()
	return {
		paths,
		fallback: false
	}
}