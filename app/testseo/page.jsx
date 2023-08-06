"use server"
import Head from "next/head";

const TestSEOPage = () => {
  return (
    <div>
      <Head>
        <title>CSR Testsssssss Page | My Next.js App</title>
        <meta
          name="description"
          content="This is a test page for client-side rendering (CSR) SEO."
        />
        <meta name="keywords" content="CSR, SEO, test, Next.js, keywords" />
        <meta name="author" content="Your Name" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="CSR Test Page" />
        <meta
          property="og:description"
          content="This is a test page for client-side rendering (CSR) SEO."
        />
        <meta property="og:image" content="/images/seo-image.jpg" />
      </Head>

      <h1>Client-Side Rendering (CSR) Test Page</h1>
      <p>This is a test page for client-side rendering (CSR) SEO.</p>
      <img src="/images/seo-image.jpg" alt="SEO Image" />
    </div>
  );
};

export default TestSEOPage;
