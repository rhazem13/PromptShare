import "@styles/globals.css";

import Nav from "@components/Nav";
import Provider from "@components/Provider";
export const metadata = {
  title: "Promptshare",
  description: "Discover and share text prompts.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://prompt-share-tau.vercel.app"),
};
const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>
          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
