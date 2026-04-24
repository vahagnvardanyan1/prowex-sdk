import { BaseResource } from "@/resources/base";
import type { RequestOptions } from "@/core/types";
import type {
  Agent,
  ToolDefinition,
  UpdateAgentPayload,
  CreateBetaAgentPayload,
  GeneratedConfig,
  SuggestedTool,
} from "@/types/agent";

export class Agents extends BaseResource {
  async list(options?: RequestOptions): Promise<Agent[]> {
    return this.client.get<Agent[]>("/agents", options);
  }

  async retrieve(id: string, options?: RequestOptions): Promise<Agent> {
    return this.client.get<Agent>(`/agents/${id}`, options);
  }

  async create(payload: CreateBetaAgentPayload, options?: RequestOptions): Promise<Agent> {
    return this.client.post<Agent>("/agents", payload, options);
  }

  async update(
    id: string,
    payload: Partial<UpdateAgentPayload>,
    options?: RequestOptions,
  ): Promise<Agent> {
    return this.client.put<Agent>(`/agents/${id}`, payload, options);
  }

  async delete(id: string, options?: RequestOptions): Promise<void> {
    return this.client.delete(`/agents/${id}`, options);
  }

  async clone(id: string, options?: RequestOptions): Promise<Agent> {
    return this.client.post<Agent>(`/agents/${id}/clone`, undefined, options);
  }

  async generate(
    description: string,
    options?: RequestOptions,
  ): Promise<{ agentConfig: GeneratedConfig; suggestedTools: SuggestedTool[] }> {
    return this.client.post("/agents/generate", { description }, options);
  }

  async generatePrompt(
    opts: { name: string; description: string; tools: string[] },
    options?: RequestOptions,
  ): Promise<{ systemPrompt: string }> {
    return this.client.post("/agents/generate-prompt", opts, options);
  }

  async availableTools(options?: RequestOptions): Promise<string[]> {
    return this.client.get<string[]>("/agents/meta/tools", options);
  }

  async toolDefinitions(options?: RequestOptions): Promise<ToolDefinition[]> {
    return this.client.get<ToolDefinition[]>("/tools", options);
  }

  async uploadResource(
    id: string,
    file: Blob,
    filename: string,
    options?: RequestOptions,
  ): Promise<unknown> {
    const formData = new FormData();
    formData.append("file", file, filename);
    return this.client.postFormData(`/agents/${id}/resources/upload`, formData, options);
  }
}
