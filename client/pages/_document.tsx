import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link rel="shortcut icon" href="/images/favicon.png" />
      </Head>
      <body className="bg-[#000] text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
