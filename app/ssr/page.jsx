import { Fragment } from "react";

export const metadata = {
  title: "SEO Test Page | My Next.js App",
  description: "This is a test page for SEO testing.",
  keywords: "SEO, test, Next.js, keywords",
  authors: [{ name: "Your Name" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "SEO Test Page",
    description: "This is a test page for SEO testing.",
    images: [
      {
        url: "/images/seo-image.jpg",
      },
    ],
  },
};

const SEOTestPage = () => {
  const data = "Sample data from server"; // Simulated data from the server

  return (
    <Fragment>
      <h1>SEO Test Page</h1>
      <p>This is a test page for SEO testing.</p>
      <p>Data from the server: {data}</p>
      <img src="/images/seo-image.jpg" alt="SEO Image" />
    </Fragment>
  );
};

export default SEOTestPage;
