import { BaseResource } from "@/resources/base";
import type { RequestOptions } from "@/core/types";
import type { McpServer } from "@/types/mcp";

export class Mcp extends BaseResource {
  async list(options?: RequestOptions): Promise<McpServer[]> {
    return this.client.get<McpServer[]>("/tools/mcp/servers", options);
  }

  async connect(
    payload: {
      name: string;
      transport: "stdio" | "http";
      url?: string;
      command?: string;
      args?: string[];
    },
    options?: RequestOptions,
  ): Promise<{ discoveredTools: string[] }> {
    return this.client.post("/tools/mcp/servers", payload, options);
  }

  async disconnect(serverName: string, options?: RequestOptions): Promise<void> {
    return this.client.delete(`/tools/mcp/servers/${serverName}`, options);
  }

  async listBuiltin(options?: RequestOptions): Promise<unknown[]> {
    return this.client.get<unknown[]>("/mcp", options);
  }

  async builtinTools(serverName: string, options?: RequestOptions): Promise<{
    server: string;
    url?: string;
    tools: unknown[];
  }> {
    return this.client.get(`/mcp/${serverName}/tools`, options);
  }

  async sendMessage(
    serverName: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this.client.post(`/mcp/${serverName}/message`, body, options);
  }
}
