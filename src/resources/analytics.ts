import { BaseResource } from "@/resources/base";
import type { RequestOptions } from "@/core/types";
import type { DashboardData, DailySummary, AgentSummary, ModelSummary } from "@/types/analytics";

interface DateRange {
  from?: string;
  to?: string;
}

export class Analytics extends BaseResource {
  async dashboard({
    range,
    options,
  }: { range?: DateRange; options?: RequestOptions } = {}): Promise<DashboardData> {
    return this.client.get<DashboardData>("/analytics/dashboard", {
      ...options,
      query: { ...options?.query, ...range },
    });
  }

  async daily({ range, options }: { range?: DateRange; options?: RequestOptions } = {}): Promise<
    DailySummary[]
  > {
    return this.client.get<DailySummary[]>("/analytics/daily", {
      ...options,
      query: { ...options?.query, ...range },
    });
  }

  async byAgent({ range, options }: { range?: DateRange; options?: RequestOptions } = {}): Promise<
    AgentSummary[]
  > {
    return this.client.get<AgentSummary[]>("/analytics/by-agent", {
      ...options,
      query: { ...options?.query, ...range },
    });
  }

  async byModel({ range, options }: { range?: DateRange; options?: RequestOptions } = {}): Promise<
    ModelSummary[]
  > {
    return this.client.get<ModelSummary[]>("/analytics/by-model", {
      ...options,
      query: { ...options?.query, ...range },
    });
  }
}
