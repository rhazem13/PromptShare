import Feed from '@components/Feed'

const Home = () => {
  return (
    <div className="div">
      <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">
          Discover & Share
          <br className="min-md:hidden" />
          <span className="orange_gradient text-center">
            AI-Powered Prompts
          </span>
        </h1>
        <p className="desc text-center">
          PromptShare is an open-source AI prompting tool for modern world to
          discover, create and share creative prompts
        </p>
        <p className="desc text-center" style={{ fontSize: "12px" }}>
          Hazem Ragab 2023 ©
        </p>

        <Feed />
      </section>
    </div>
  );
}

export default Home;