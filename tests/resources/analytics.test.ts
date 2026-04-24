import { describe, it, expect } from "vitest";
import { Prowex } from "../../src/client";

const prowex = new Prowex({ apiKey: "test-key", baseURL: "https://api.prowex.ai" });

describe("Analytics resource", () => {
  it("gets dashboard data", async () => {
    const data = await prowex.analytics.dashboard();
    expect(data.totalCalls).toBe(10);
    expect(data.totalCost).toBe(0.05);
  });

  it("gets dashboard with date range", async () => {
    const data = await prowex.analytics.dashboard({
      range: { from: "2025-01-01", to: "2025-12-31" },
    });
    expect(data).toBeDefined();
  });

  it("gets daily summary", async () => {
    const data = await prowex.analytics.daily();
    expect(data).toEqual([]);
  });

  it("gets by-agent summary", async () => {
    const data = await prowex.analytics.byAgent();
    expect(data).toEqual([]);
  });

  it("gets by-model summary", async () => {
    const data = await prowex.analytics.byModel();
    expect(data).toEqual([]);
  });
});
