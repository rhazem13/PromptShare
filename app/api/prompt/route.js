import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({}).populate("creator");
    const responseHeaders = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, must-revalidate",
    };
    return new Response(JSON.stringify(prompts), { status: 200, headers: responseHeaders });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
