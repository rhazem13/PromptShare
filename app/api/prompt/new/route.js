import { getServerSession } from "next-auth/next";
import { authOptions } from "@utils/auth";
import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const POST = async (request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ message: "Authentication required" }, { status: 401 });
    }
    const { prompt, tag } = await request.json();
    if (typeof prompt !== "string" || !prompt.trim() || typeof tag !== "string" || !tag.trim()) {
      return Response.json({ message: "Prompt and tag are required" }, { status: 400 });
    }
    await connectToDB();
    const created = new Prompt({ creator: session.user.id, prompt, tag });
    await created.save();
    return Response.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ message: "Invalid JSON" }, { status: 400 });
    return Response.json({ message: "Unable to create prompt" }, { status: 500 });
  }
};
