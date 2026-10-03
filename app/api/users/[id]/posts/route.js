import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request, {params}) => {
  try {
    await connectToDB();
    
    const prompts = await Prompt.find({
        creator: params.id
    }).populate("creator", "username image");
    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.error("Database request failed");
    return new Response(JSON.stringify({ message: "Request failed" }), { status: 500 });
  }
};
