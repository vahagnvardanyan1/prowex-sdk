import { describe, it, expect } from "vitest";
import { Prowex } from "../../src/client";

const prowex = new Prowex({ apiKey: "test-key", baseURL: "https://api.prowex.ai" });

describe("Mcp resource", () => {
  it("lists MCP servers", async () => {
    const servers = await prowex.mcp.list();
    expect(servers).toEqual([]);
  });

  it("connects an MCP server", async () => {
    const result = await prowex.mcp.connect({
      payload: {
        name: "test-server",
        transport: "http",
        url: "http://localhost:8080",
      },
    });
    expect(result.discoveredTools).toContain("tool1");
  });

  it("disconnects an MCP server", async () => {
    await expect(
      prowex.mcp.disconnect({ serverName: "test-server" }),
    ).resolves.toBeUndefined();
  });

  it("lists builtin MCP servers", async () => {
    const servers = await prowex.mcp.listBuiltin();
    expect(servers).toEqual([]);
  });

  it("lists builtin server tools", async () => {
    const result = await prowex.mcp.builtinTools({ serverName: "test-server" });
    expect(result.server).toBe("test");
  });
});
