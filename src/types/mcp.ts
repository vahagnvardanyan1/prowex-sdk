export interface McpServer {
  name: string;
  transport: string;
  toolCount: number;
  connected: boolean;
  discoveredAt: string;
}
