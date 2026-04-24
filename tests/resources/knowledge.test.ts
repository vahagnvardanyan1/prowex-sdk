import { describe, it, expect } from "vitest";
import { Prowex } from "../../src/client";

const prowex = new Prowex({ apiKey: "test-key", baseURL: "https://api.prowex.ai" });

describe("Knowledge resource", () => {
  it("lists knowledge bases", async () => {
    const kbs = await prowex.knowledge.list();
    expect(kbs).toEqual([]);
  });

  it("creates a knowledge base", async () => {
    const kb = await prowex.knowledge.create({ name: "Test KB" });
    expect(kb.id).toBe("kb-1");
  });

  it("adds a document", async () => {
    const result = await prowex.knowledge.addDocument({
      kbId: "kb-1",
      text: "text content",
      filename: "file.txt",
    });
    expect(result.documentId).toBe("doc-1");
  });

  it("deletes a knowledge base", async () => {
    await expect(prowex.knowledge.delete({ id: "kb-1" })).resolves.toBeUndefined();
  });
});
