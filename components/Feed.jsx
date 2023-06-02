"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((prompt) => (
        <PromptCard
          key={prompt._id}
          prompt={prompt}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const handleSearchChange = (e) => {
    // filter prompts based on search text 
    // the search text filters based on tags and usernames and prompt text
    setSearchText(e.target.value);
    const filteredPrompts = prompts.filter((prompt) => {
      const promptText = prompt.prompt.toLowerCase();
      const tag = prompt.tag.toLowerCase();
      const username = prompt.creator.username.toLowerCase();
      return (
        promptText.includes(e.target.value.toLowerCase()) ||
        tag.includes(e.target.value.toLowerCase()) ||
        username.includes(e.target.value.toLowerCase())
      );
    }
    );
    setFilteredPrompts(filteredPrompts);

  };
  const handleTagClick = (tag) => {
    // filter prompts based on tag
    setSearchText(tag);
    const filteredPrompts = prompts.filter((prompt) => {
      const prompttag = prompt.tag.toLowerCase();
      return prompttag.includes(tag.toLowerCase());
    }
    );
    setFilteredPrompts(filteredPrompts);
  }
  useEffect(() => {
    const fetchPrompts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPrompts(data);
      console.log(data);
      setFilteredPrompts(data);
    };
    fetchPrompts();
  },[]);
  return (
    <section className="feed">
      <form className="relative w-full flext-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList data={filteredPrompts} handleTagClick={(tag) => {handleTagClick(tag)}} />
    </section>
  );
};

export default Feed;
