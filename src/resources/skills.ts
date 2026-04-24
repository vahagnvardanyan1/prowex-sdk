import { BaseResource } from "@/resources/base";
import type { RequestOptions } from "@/core/types";
import type { SkillSummary } from "@/types/agent";

export class Skills extends BaseResource {
  async list(category?: string, options?: RequestOptions): Promise<SkillSummary[]> {
    return this.client.get<SkillSummary[]>("/skills", {
      ...options,
      query: { ...options?.query, ...(category ? { category } : {}) },
    });
  }

  async retrieve(id: string, options?: RequestOptions): Promise<SkillSummary> {
    return this.client.get<SkillSummary>(`/skills/${id}`, options);
  }
}
