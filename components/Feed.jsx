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
    setSearchText(e.target.value);
    const filterText = e.target.value.toLowerCase();
    const filteredPrompts = prompts.filter((prompt) => {
      const promptText = prompt.prompt.toLowerCase();
      const tag = prompt.tag.toLowerCase();
      const username = prompt.creator.username.toLowerCase();
      return (
        promptText.includes(filterText) ||
        tag.includes(filterText) ||
        username.includes(filterText)
      );
    });
    setFilteredPrompts(filteredPrompts);
  };
  const handleTagClick = (tag) => {
    setSearchText(tag);
    const filterText = tag.toLowerCase();
    const filteredPrompts = prompts.filter((prompt) => {
      const prompttag = prompt.tag.toLowerCase();
      return prompttag.includes(filterText);
    });
    setFilteredPrompts(filteredPrompts);
  };
  useEffect(() => {
    const fetchPrompts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPrompts(data);
      setFilteredPrompts(data);
    };
    fetchPrompts();
  }, []);
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
      <PromptCardList
        data={filteredPrompts}
        handleTagClick={(tag) => {
          handleTagClick(tag);
        }}
      />
    </section>
  );
};

export default Feed;
