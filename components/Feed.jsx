"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import PromptCard from "./PromptCard";
import { useRouter } from "next/navigation";
import usePageVisibility from "@utils/usePageVisibility";
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
  const router = useRouter();
  const isVisible = usePageVisibility();

  const [searchText, setSearchText] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  // useLayoutEffect(() => {
  //   const fetchPrompts = async () => {
  //     const response = await fetch("/api/prompt");
  //     const data = await response.json();
  //     setPrompts(data);
  //     setFilteredPrompts(data);
  //   };
  //   fetchPrompts();
  // }, []);
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
      console.log("Feed Component Loaded: v2 (Safe Fetch)");
      try {
        const response = await fetch("/api/prompt", { next: { revalidate: 1 } });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setPrompts(data);
          setFilteredPrompts(data);
        } else {
          console.error("API returned non-array data:", data);
          setPrompts([]);
          setFilteredPrompts([]);
        }
      } catch (error) {
        console.error("Failed to fetch prompts:", error);
        setPrompts([]);
        setFilteredPrompts([]);
      }
    };
    if (isVisible) {
      fetchPrompts();
    }
  }, [isVisible]);
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
