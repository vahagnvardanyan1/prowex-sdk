import { describe, it, expect } from "vitest";
import { Prowex } from "../../src/client";

const prowex = new Prowex({ apiKey: "test-key", baseURL: "https://api.prowex.ai" });

describe("Skills resource", () => {
  it("lists skills", async () => {
    const skills = await prowex.skills.list();
    expect(skills).toHaveLength(1);
    expect(skills[0].id).toBe("deep-research");
  });

  it("retrieves a skill", async () => {
    const skill = await prowex.skills.retrieve("deep-research");
    expect(skill.name).toBe("Deep Research");
  });
});
