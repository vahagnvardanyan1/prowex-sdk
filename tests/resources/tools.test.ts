import { describe, it, expect } from "vitest";
import { Prowex } from "../../src/client";

const prowex = new Prowex({ apiKey: "test-key", baseURL: "https://api.prowex.ai" });

describe("Tools resource", () => {
  it("lists tools", async () => {
    const tools = await prowex.tools.list();
    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe("calculator");
  });

  it("retrieves a tool by name", async () => {
    const tool = await prowex.tools.retrieve({ name: "calculator" });
    expect(tool.name).toBe("calculator");
  });

  it("creates a custom tool", async () => {
    const tool = await prowex.tools.create({
      payload: { name: "my_tool", httpEndpoint: "https://example.com/api" },
    });
    expect(tool.name).toBe("calculator");
  });

  it("updates a custom tool", async () => {
    const tool = await prowex.tools.update({
      id: "tool-1",
      payload: { description: "Updated" },
    });
    expect(tool).toBeDefined();
  });

  it("deletes a custom tool", async () => {
    await expect(prowex.tools.delete({ id: "tool-1" })).resolves.toBeUndefined();
  });

  describe("secrets", () => {
    it("sets a secret", async () => {
      const result = await prowex.tools.secrets.set({
        toolName: "calculator",
        key: "API_KEY",
        value: "secret123",
      });
      expect(result.ok).toBe(true);
    });

    it("lists secrets", async () => {
      const result = await prowex.tools.secrets.list({ toolName: "calculator" });
      expect(result.toolName).toBe("calculator");
      expect(result.keys).toContain("API_KEY");
    });

    it("deletes a secret", async () => {
      await expect(
        prowex.tools.secrets.delete({ toolName: "calculator", key: "API_KEY" }),
      ).resolves.toBeUndefined();
    });
  });
});
