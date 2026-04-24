import { describe, it, expect } from "vitest";
import { Prowex } from "../../src/client";

const prowex = new Prowex({ apiKey: "test-key", baseURL: "https://api.prowex.ai" });

describe("Schedules resource", () => {
  it("lists schedules", async () => {
    const schedules = await prowex.schedules.list({ agentId: "agent-1" });
    expect(schedules).toHaveLength(1);
  });

  it("retrieves a schedule", async () => {
    const schedule = await prowex.schedules.retrieve({
      agentId: "agent-1",
      scheduleId: "sched-1",
    });
    expect(schedule.id).toBe("sched-1");
  });

  it("creates a schedule", async () => {
    const schedule = await prowex.schedules.create({
      agentId: "agent-1",
      data: { cronExpression: "0 * * * *", inputMessage: "Run hourly" },
    });
    expect(schedule.cronExpression).toBe("0 * * * *");
  });

  it("updates a schedule", async () => {
    const schedule = await prowex.schedules.update({
      agentId: "agent-1",
      scheduleId: "sched-1",
      data: { enabled: false },
    });
    expect(schedule).toBeDefined();
  });

  it("deletes a schedule", async () => {
    await expect(
      prowex.schedules.delete({ agentId: "agent-1", scheduleId: "sched-1" }),
    ).resolves.toBeUndefined();
  });

  it("triggers a schedule", async () => {
    await expect(
      prowex.schedules.trigger({ agentId: "agent-1", scheduleId: "sched-1" }),
    ).resolves.toBeUndefined();
  });

  it("gets schedule runs", async () => {
    const runs = await prowex.schedules.runs({
      agentId: "agent-1",
      scheduleId: "sched-1",
    });
    expect(runs).toEqual([]);
  });
});
