import '../styles/globals.css'
import { ApolloProvider } from "@apollo/client"
import client from "../apollo-client"

function MyApp({ Component, pageProps }) {
  // use the apollo provider to allow client side rendering
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
    )
}

export default MyApp
