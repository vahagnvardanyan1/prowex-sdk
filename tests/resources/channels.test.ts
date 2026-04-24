import { describe, it, expect } from "vitest";
import { Prowex } from "../../src/client";

const prowex = new Prowex({ apiKey: "test-key", baseURL: "https://api.prowex.ai" });

describe("Channels resource", () => {
  it("lists channels", async () => {
    const channels = await prowex.channels.list();
    expect(channels).toHaveLength(1);
    expect(channels[0].type).toBe("telegram");
  });

  it("retrieves a channel", async () => {
    const channel = await prowex.channels.retrieve({ id: "chan-1" });
    expect(channel.id).toBe("chan-1");
  });

  it("deletes a channel", async () => {
    await expect(prowex.channels.delete({ id: "chan-1" })).resolves.toBeUndefined();
  });

  it("generates a telegram link", async () => {
    const link = await prowex.channels.telegram.generateLink();
    expect(link.linkToken).toBe("tok");
    expect(link.deepLink).toContain("t.me");
  });
});
