export interface DashboardData {
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  totalCalls: number;
  avgLatencyMs: number;
}

export interface DailySummary {
  date: string;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  callCount: number;
}

export interface AgentSummary {
  agentId: string;
  agentName?: string;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  callCount: number;
}

export interface ModelSummary {
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  callCount: number;
}

export interface AnalyticsData {
  dashboard: DashboardData | null;
  daily: DailySummary[];
  byAgent: AgentSummary[];
  byModel: ModelSummary[];
}
