import Head from "next/head";

const TestSEOPage = ({ data }) => {
  return (
    <div>
      <Head>
        <title>SSR Test Page | My Next.js App</title>
        <meta
          name="description"
          content="This is a test page for server-side rendering (SSR) SEO."
        />
        <meta name="keywords" content="SSR, SEO, test, Next.js, keywords" />
        <meta name="author" content="Your Name" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="SSR Test Page" />
        <meta
          property="og:description"
          content="This is a test page for server-side rendering (SSR) SEO."
        />
        <meta property="og:image" content="/images/seo-image.jpg" />
      </Head>

      <h1>Server-Side Rendering (SSR) Test Page</h1>
      <p>This is a test page for server-side rendering (SSR) SEO.</p>
      <p>Data from the server: {data}</p>
      <img src="/images/seo-image.jpg" alt="SEO Image" />
    </div>
  );
};

export async function getServerSideProps() {
  const data = "Sample data from server"; // Simulated data from the server
  return {
    props: {
      data,
    },
  };
}

export default TestSEOPage;
