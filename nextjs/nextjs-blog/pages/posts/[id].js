import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'

export default function Post({ postData }) {
  return (
  <Layout>
  	{postData.title}
  	<br />
  	{postData.id}
  	<br />
  	{postData.date}
  </Layout>
  )
}

export async function getStaticPaths() {
	const paths = getAllPostIds()
	return {
		paths,
		fallback: false
	}
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  console.log(postData)
  return {
    props: {
      postData
    }
  }
}