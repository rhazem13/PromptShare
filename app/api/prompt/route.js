import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import { revalidatePath } from "next/cache";

export const GET = async (request, {params}) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({}).populate("creator");
    const responseHeaders = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, must-revalidate",
    };

    //To dynamically get the path
    const path = request.nextUrl.searchParams.get("path") || "/";

    revalidatePath(path);
    return new Response(JSON.stringify(prompts), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
  // comment
};
