import { getServerSession } from "next-auth/next";
import { isObjectIdOrHexString } from "mongoose";
import { authOptions } from "@utils/auth";
import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request, { params }) => {
  try {
    const { id } = await params;
    if (!isObjectIdOrHexString(id)) return Response.json({ message: "Prompt not found" }, { status: 404 });
    await connectToDB();
    const prompt = await Prompt.findById(id).populate("creator", "username image");
    if (!prompt) return Response.json({ message: "Prompt not found" }, { status: 404 });
    return Response.json(prompt);
  } catch {
    return Response.json({ message: "Unable to fetch prompt" }, { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return Response.json({ message: "Authentication required" }, { status: 401 });
    const { id } = await params;
    if (!isObjectIdOrHexString(id)) return Response.json({ message: "Prompt not found" }, { status: 404 });
    await connectToDB();
    const existing = await Prompt.findById(id);
    if (!existing) return Response.json({ message: "Prompt not found" }, { status: 404 });
    if (existing.creator.toString() !== session.user.id) return Response.json({ message: "Forbidden" }, { status: 403 });
    const { prompt, tag } = await request.json();
    if (typeof prompt !== "string" || !prompt.trim() || typeof tag !== "string" || !tag.trim()) {
      return Response.json({ message: "Prompt and tag are required" }, { status: 400 });
    }
    existing.prompt = prompt;
    existing.tag = tag;
    await existing.save();
    return Response.json(existing);
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ message: "Invalid JSON" }, { status: 400 });
    return Response.json({ message: "Unable to update prompt" }, { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return Response.json({ message: "Authentication required" }, { status: 401 });
    const { id } = await params;
    if (!isObjectIdOrHexString(id)) return Response.json({ message: "Prompt not found" }, { status: 404 });
    await connectToDB();
    const existing = await Prompt.findById(id);
    if (!existing) return Response.json({ message: "Prompt not found" }, { status: 404 });
    if (existing.creator.toString() !== session.user.id) return Response.json({ message: "Forbidden" }, { status: 403 });
    await Prompt.deleteOne({ _id: id, creator: session.user.id });
    return Response.json({ message: "Prompt deleted" });
  } catch {
    return Response.json({ message: "Unable to delete prompt" }, { status: 500 });
  }
};
