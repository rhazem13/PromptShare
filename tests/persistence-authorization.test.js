import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import User from "@models/user";
import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { authOptions } from "@utils/auth";
import { POST } from "../app/api/prompt/new/route";
import { PATCH, DELETE, GET } from "../app/api/prompt/[id]/route";

// Only the framework session boundary is substituted. Models, queries, and
// the session callback's identity lookup use real MongoDB persistence.
vi.mock("next-auth/next", () => ({ getServerSession: vi.fn() }));

const enabled = process.env.RUN_MONGO_INTEGRATION === "1";
let owner;
let other;

function request(method, payload = { prompt: "Updated test prompt", tag: "test" }) {
  return new Request("http://localhost/api/prompt", {
    method,
    ...(method === "DELETE" ? {} : { body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } }),
  });
}
function context(id) { return { params: Promise.resolve({ id: String(id) }) }; }
function authenticate(user) {
  getServerSession.mockImplementation(() => authOptions.callbacks.session({
    session: { user: { email: user.email, id: "client-provided-value-is-ignored" } },
  }));
}

describe.skipIf(!enabled)("write authorization with real MongoDB persistence", () => {
  beforeAll(async () => {
    const uri = process.env.TEST_MONGODB_URI;
    // This test resets share_prompt on a dedicated disposable local container.
    // Refuse remote hosts and the usual application port.
    if (!uri || !/^mongodb:\/\/(127\.0\.0\.1|localhost):57017\//.test(uri)) {
      throw new Error("TEST_MONGODB_URI must use the disposable local MongoDB port 57017");
    }
    process.env.MONGODB_URI = uri;
    await connectToDB();
  });
  beforeEach(async () => {
    await Promise.all([Prompt.deleteMany({}), User.deleteMany({})]);
    [owner, other] = await User.create([
      { email: "owner@example.invalid", username: "testowner" },
      { email: "other@example.invalid", username: "testother" },
    ]);
    getServerSession.mockResolvedValue(null);
  });
  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  });

  it("derives creator from the authenticated identity and persists owner-only changes", async () => {
    authenticate(owner);
    const created = await POST(request("POST", { prompt: "New test prompt", tag: "test", userId: String(other._id), creator: String(other._id) }));
    expect(created.status).toBe(201);
    const body = await created.json();
    const stored = await Prompt.findById(body._id).lean();
    expect(String(stored.creator)).toBe(String(owner._id));
    expect(stored.prompt).toBe("New test prompt");
    const updated = await PATCH(request("PATCH"), context(body._id));
    expect(updated.status).toBe(200);
    expect((await Prompt.findById(body._id).lean()).prompt).toBe("Updated test prompt");
    expect((await DELETE(request("DELETE"), context(body._id))).status).toBe(200);
    expect(await Prompt.findById(body._id)).toBeNull();
  });

  it.each([["PATCH", PATCH], ["DELETE", DELETE]])("%s denies a different owner and preserves the stored record", async (method, handler) => {
    const original = await Prompt.create({ creator: owner._id, prompt: "Original test prompt", tag: "test" });
    authenticate(other);
    expect((await handler(request(method), context(original._id))).status).toBe(403);
    const stored = await Prompt.findById(original._id).lean();
    expect(stored.prompt).toBe("Original test prompt");
    expect(String(stored.creator)).toBe(String(owner._id));
  });

  it("denies anonymous writes and leaves persistence unchanged", async () => {
    const original = await Prompt.create({ creator: owner._id, prompt: "Original test prompt", tag: "test" });
    expect((await POST(request("POST"))).status).toBe(401);
    expect((await PATCH(request("PATCH"), context(original._id))).status).toBe(401);
    expect((await DELETE(request("DELETE"), context(original._id))).status).toBe(401);
    expect(await Prompt.countDocuments()).toBe(1);
    expect((await Prompt.findById(original._id).lean()).prompt).toBe("Original test prompt");
  });

  it("public reads omit the creator's email", async () => {
    const original = await Prompt.create({ creator: owner._id, prompt: "Public test prompt", tag: "test" });
    const response = await GET(new Request("http://localhost/api/prompt"), context(original._id));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.creator.username).toBe("testowner");
    expect(body.creator).not.toHaveProperty("email");
  });

  it("rejects missing resources and unregistered session identities", async () => {
    authenticate(owner);
    const missing = context(new mongoose.Types.ObjectId());
    expect((await PATCH(request("PATCH"), missing)).status).toBe(404);
    expect((await DELETE(request("DELETE"), missing)).status).toBe(404);
    authenticate({ email: "not-registered@example.invalid" });
    expect((await POST(request("POST"))).status).toBe(401);
    expect(await Prompt.countDocuments()).toBe(0);
  });
});
