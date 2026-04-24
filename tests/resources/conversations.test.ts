import { describe, it, expect } from "vitest";
import { Prowex } from "../../src/client";

const prowex = new Prowex({ apiKey: "test-key", baseURL: "https://api.prowex.ai" });

describe("Conversations resource", () => {
  it("creates a conversation", async () => {
    const conv = await prowex.conversations.create("agent-1");
    expect(conv.id).toBe("conv-1");
    expect(conv.agentId).toBe("agent-1");
  });

  it("lists conversations for an agent", async () => {
    const convs = await prowex.conversations.list("agent-1");
    expect(convs).toHaveLength(1);
  });

  it("gets messages", async () => {
    const messages = await prowex.conversations.messages("conv-1");
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toBe("Hello!");
  });

  it("gets usage", async () => {
    const usage = await prowex.conversations.usage("conv-1");
    expect(usage.totalTokens).toBe(100);
  });

  it("sends a message (non-streaming)", async () => {
    const result = await prowex.conversations.sendMessage("conv-1", "Hello");
    expect(result.response).toBe("Hello!");
  });

  it("sends a message (streaming)", async () => {
    const stream = await prowex.conversations.stream("conv-1", "Hello");
    const events = [];
    for await (const event of stream) {
      events.push(event);
    }
    expect(events.length).toBeGreaterThan(0);
    const text = await stream.finalText();
    expect(text).toBe("Hi");
  });

  it("resumes a conversation stream", async () => {
    const stream = await prowex.conversations.resumeStream("conv-1", "yes");
    const text = await stream.finalText();
    expect(text).toBe("Resumed");
  });

  it("deletes a conversation", async () => {
    await expect(prowex.conversations.delete("conv-1")).resolves.toBeUndefined();
  });
});
