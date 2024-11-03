import Layout from '../app/layout'
import Head from 'next/head';
 
export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
       <Head>
        <title>Niel Eche</title> {/* Set your default title here */}
        <meta name="description" content="Dummy Characters" />
        {/* You can add other meta tags here */}
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}