import { describe, it, expect } from "vitest";
import { Prowex } from "../../src/client";

const prowex = new Prowex({ apiKey: "test-key", baseURL: "https://api.prowex.ai" });

describe("Agents resource", () => {
  it("lists agents", async () => {
    const agents = await prowex.agents.list();
    expect(agents).toHaveLength(1);
    expect(agents[0].name).toBe("Test Agent");
  });

  it("retrieves a single agent", async () => {
    const agent = await prowex.agents.retrieve("agent-1");
    expect(agent.id).toBe("agent-1");
    expect(agent.provider).toBe("anthropic");
  });

  it("creates an agent", async () => {
    const agent = await prowex.agents.create({
      name: "New Agent",
      model: "claude-sonnet-4-6",
    });
    expect(agent.id).toBe("agent-1");
  });

  it("updates an agent", async () => {
    const agent = await prowex.agents.update("agent-1", { name: "Updated" });
    expect(agent.name).toBe("Test Agent");
  });

  it("deletes an agent", async () => {
    await expect(prowex.agents.delete("agent-1")).resolves.toBeUndefined();
  });

  it("clones an agent", async () => {
    const clone = await prowex.agents.clone("agent-1");
    expect(clone.id).toBe("agent-1");
  });

  it("generates an agent", async () => {
    const result = await prowex.agents.generate("A helpful assistant");
    expect(result.agentConfig).toBeDefined();
    expect(result.suggestedTools).toBeDefined();
  });

  it("generates a system prompt", async () => {
    const result = await prowex.agents.generatePrompt({
      name: "Test",
      description: "Test agent",
      tools: ["calculator"],
    });
    expect(result.systemPrompt).toBe("Generated prompt");
  });

  it("lists available tools", async () => {
    const tools = await prowex.agents.availableTools();
    expect(tools).toContain("calculator");
  });

  it("lists tool definitions", async () => {
    const tools = await prowex.agents.toolDefinitions();
    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe("calculator");
  });
});
