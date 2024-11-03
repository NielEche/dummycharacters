import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Niel Eche" />
        <meta name="keywords" content="DummyCharacters, Dummy, Characters , Niel Eche , Port Harcourt , Creative , tech , design , archivist , artist " />
        <meta property="og:image" content='/logo.png' />
        <meta property="og:image:alt" content="Logo for Dummy Characters " />
        <meta property="og:url" content="https://dummy-characters.space" />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}