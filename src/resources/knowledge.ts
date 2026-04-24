import { BaseResource } from "@/resources/base";
import type { RequestOptions } from "@/core/types";
import type { KnowledgeBase } from "@/types/agent";

export class Knowledge extends BaseResource {
  async list({ options }: { options?: RequestOptions } = {}): Promise<KnowledgeBase[]> {
    return this.client.get<KnowledgeBase[]>("/knowledge", options);
  }

  async create({
    name,
    embeddingProvider,
    options,
  }: {
    name: string;
    embeddingProvider?: string;
    options?: RequestOptions;
  }): Promise<KnowledgeBase> {
    return this.client.post<KnowledgeBase>(
      "/knowledge",
      { name, embeddingProvider: embeddingProvider ?? "openai" },
      options,
    );
  }

  async addDocument({
    kbId,
    text,
    filename,
    options,
  }: {
    kbId: string;
    text: string;
    filename: string;
    options?: RequestOptions;
  }): Promise<{ documentId: string }> {
    return this.client.post(`/knowledge/${kbId}/documents`, { text, filename }, options);
  }

  async delete({ id, options }: { id: string; options?: RequestOptions }): Promise<void> {
    return this.client.delete(`/knowledge/${id}`, options);
  }
}
