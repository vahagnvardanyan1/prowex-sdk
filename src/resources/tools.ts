import { BaseResource } from "@/resources/base";
import type { RequestOptions } from "@/core/types";
import type { ToolDefinition } from "@/types/agent";
import type { ToolSecret } from "@/types/secret";

export class Tools extends BaseResource {
  async list({
    query,
    options,
  }: {
    query?: { category?: string; mcpServerId?: string };
    options?: RequestOptions;
  } = {}): Promise<ToolDefinition[]> {
    return this.client.get<ToolDefinition[]>("/tools", {
      ...options,
      query: { ...options?.query, ...query },
    });
  }

  async retrieve({
    name,
    options,
  }: {
    name: string;
    options?: RequestOptions;
  }): Promise<ToolDefinition> {
    return this.client.get<ToolDefinition>(`/tools/${name}`, options);
  }

  async create({
    payload,
    options,
  }: {
    payload: {
      name: string;
      displayName?: string;
      description?: string;
      category?: string;
      httpEndpoint: string;
      httpMethod?: string;
      httpHeaders?: Record<string, string>;
      inputSchema?: Record<string, unknown>;
    };
    options?: RequestOptions;
  }): Promise<ToolDefinition> {
    return this.client.post<ToolDefinition>("/tools", payload, options);
  }

  async update({
    id,
    payload,
    options,
  }: {
    id: string;
    payload: Partial<{
      displayName: string;
      description: string;
      category: string;
      httpEndpoint: string;
      httpMethod: string;
      httpHeaders: Record<string, string>;
      inputSchema: Record<string, unknown>;
    }>;
    options?: RequestOptions;
  }): Promise<ToolDefinition> {
    return this.client.put<ToolDefinition>(`/tools/${id}`, payload, options);
  }

  async delete({ id, options }: { id: string; options?: RequestOptions }): Promise<void> {
    return this.client.delete(`/tools/${id}`, options);
  }

  readonly secrets = {
    set: async ({
      toolName,
      key,
      value,
      options,
    }: {
      toolName: string;
      key: string;
      value: string;
      options?: RequestOptions;
    }): Promise<{ ok: boolean }> => {
      return this.client.post(`/tools/${toolName}/secrets`, { key, value }, options);
    },

    list: async ({
      toolName,
      options,
    }: {
      toolName: string;
      options?: RequestOptions;
    }): Promise<ToolSecret> => {
      return this.client.get<ToolSecret>(`/tools/${toolName}/secrets`, options);
    },

    delete: async ({
      toolName,
      key,
      options,
    }: {
      toolName: string;
      key: string;
      options?: RequestOptions;
    }): Promise<void> => {
      return this.client.delete(`/tools/${toolName}/secrets/${key}`, options);
    },
  };
}
