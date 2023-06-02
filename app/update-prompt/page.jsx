"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Form from "@components/Form";
const EditPrompt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });
  useEffect(() => {
    const getPromptDetails = async () => {
      const res = await fetch(`/api/prompt/${promptId}`);
      const json = await res.json();
      setPost({
        prompt: json.prompt,
        tag: json.tag,
      });
    };
    if (promptId) getPromptDetails();
  }, [promptId]);
  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!promptId) return alert("Prompt ID not found");
    try {
      const res = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });
      setSubmitting(false);
      const json = await res.json();
      if (!res.ok) throw Error(json.message);
      router.push("/");
    } catch (e) {
      throw Error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

export default EditPrompt;
