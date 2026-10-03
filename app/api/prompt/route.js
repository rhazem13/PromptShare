import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({}).populate("creator", "username image");
    const responseHeaders = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, must-revalidate",
    };

    return new Response(JSON.stringify(prompts), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Failed to fetch prompts");
    return new Response(JSON.stringify({ error: "Failed to fetch prompts",  }), { status: 500 });
  }
  // comment
};
