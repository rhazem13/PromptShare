"use client";
import {useState, useEffect} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import Profile from '@components/profile';
const MyProfile = () => {
  const router = useRouter();
    const {data: session} = useSession();
    const [prompts, setPrompts] = useState([]);
    useEffect(() => {
      const fetchPrompts = async () => {
        const response = await fetch(`/api/users/${session?.user.id}/posts`);
        const data = await response.json();
        setPrompts(data);
        console.log(data);
      };
      if(session?.user.id) fetchPrompts();
    }, []);
    const handleEdit = (prompt) => {
      router.push(`/update-prompt?id=${prompt._id}`);
    };
    const handleDelete = async (prompt) => {
      const hasConfirmed = confirm("Are you sure you want to delete this prompt?");
      if (hasConfirmed) {
        try {
          const res = await fetch(`/api/prompt/${prompt._id.toString()}`, {
            method: "DELETE",
          });
          const json = await res.json();
          if (!res.ok) throw Error(json.message);
          const filteredPrompts = prompts.filter((p) => p._id !== prompt._id); 
          setPrompts(filteredPrompts);
        } catch (e) {
          console.log(e);
        }
      }
    };
  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={prompts}
      handleEdit={(prompt) => handleEdit(prompt)}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
