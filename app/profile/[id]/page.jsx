"use client";
// implementing viewing other user's profile page
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Profile from "@components/profile";

const UserProfile = ({params}) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const router = useRouter();
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState([]);
  // read the id from the query string

  useEffect(() => {
    const fetchPrompts = async () => {
      const response = await fetch(`/api/users/${params?.id}/posts`);
      const data = await response.json();
      setPrompts(data);
      console.log(data);
    };
    if(params?.id)
      fetchPrompts();
  }, [params.id]);
  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
      data={prompts}
    />
  );
};

export default UserProfile;
