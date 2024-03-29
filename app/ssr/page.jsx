'use server'
import Head from "next/head";
import { Fragment } from "react";

const SEOTestPage = ({ data }) => {
  return (
    <Fragment>
      <Head>
        <title>SEO Test Page | My Next.js App</title>
        <meta
          name="description"
          content="This is a test page for SEO testing."
        />
        <meta name="keywords" content="SEO, test, Next.js, keywords" />
        <meta name="author" content="Your Name" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="SEO Test Page" />
        <meta
          property="og:description"
          content="This is a test page for SEO testing."
        />
        <meta property="og:image" content="/images/seo-image.jpg" />
      </Head>

      <h1>SEO Test Page</h1>
      <p>This is a test page for SEO testing.</p>
      <p>Data from the server: {data}</p>
      <img src="/images/seo-image.jpg" alt="SEO Image" />
    </Fragment>
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

export default SEOTestPage;
