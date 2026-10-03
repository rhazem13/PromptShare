import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import Prompt from "@models/prompt";
import { POST } from "../app/api/prompt/new/route";
import { PATCH, DELETE } from "../app/api/prompt/[id]/route";

vi.mock("next-auth/next", () => ({ getServerSession: vi.fn() }));

const ownerId = "507f1f77bcf86cd799439011";
const otherId = "507f1f77bcf86cd799439012";
const promptId = "507f1f77bcf86cd799439013";
const context = { params: Promise.resolve({ id: promptId }) };
let existing;
let save;
let remove;

beforeEach(() => {
  process.env.MONGODB_URI = "mongodb://localhost:27017/test-only";
  vi.spyOn(mongoose, "connect").mockResolvedValue(mongoose);
  existing = new Prompt({ _id: promptId, creator: ownerId, prompt: "Original", tag: "example" });
  vi.spyOn(Prompt, "findById").mockResolvedValue(existing);
  save = vi.spyOn(Prompt.prototype, "save").mockImplementation(async function () { return this; });
  remove = vi.spyOn(Prompt, "deleteOne").mockResolvedValue({ deletedCount: 1 });
  getServerSession.mockResolvedValue(null);
});

afterEach(() => { vi.restoreAllMocks(); vi.clearAllMocks(); });

function request(method, payload = { prompt: "Updated", tag: "example" }) {
  return new Request("http://localhost/api/prompt", {
    method,
    ...(method === "DELETE" ? {} : { body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } }),
  });
}

describe("server-side write authorization", () => {
  it.each([["POST", POST], ["PATCH", PATCH], ["DELETE", DELETE]])("%s rejects unauthenticated writes", async (method, handler) => {
    const response = await handler(request(method), context);
    expect(response.status).toBe(401);
    expect(save).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it.each([["PATCH", PATCH], ["DELETE", DELETE]])("%s rejects a different owner without changing the resource", async (method, handler) => {
    getServerSession.mockResolvedValue({ user: { id: otherId } });
    const response = await handler(request(method), context);
    expect(response.status).toBe(403);
    expect(existing.prompt).toBe("Original");
    expect(save).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it("create ignores a forged owner and uses the authenticated user", async () => {
    getServerSession.mockResolvedValue({ user: { id: ownerId } });
    const response = await POST(request("POST", { prompt: "New", tag: "example", userId: otherId }));
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ creator: ownerId, prompt: "New" });
    expect(save).toHaveBeenCalledOnce();
  });

  it("the owner can update their prompt", async () => {
    getServerSession.mockResolvedValue({ user: { id: ownerId } });
    const response = await PATCH(request("PATCH"), context);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ creator: ownerId, prompt: "Updated" });
    expect(save).toHaveBeenCalledOnce();
  });

  it("the owner can delete their prompt", async () => {
    getServerSession.mockResolvedValue({ user: { id: ownerId } });
    const response = await DELETE(request("DELETE"), context);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Prompt deleted" });
    expect(remove).toHaveBeenCalledWith({ _id: promptId, creator: ownerId });
  });

  it("rejects invalid input without saving", async () => {
    getServerSession.mockResolvedValue({ user: { id: ownerId } });
    const response = await POST(request("POST", { prompt: "", tag: "example" }));
    expect(response.status).toBe(400);
    expect(save).not.toHaveBeenCalled();
  });
});
