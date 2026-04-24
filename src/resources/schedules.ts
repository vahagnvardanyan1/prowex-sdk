import { BaseResource } from "@/resources/base";
import type { RequestOptions } from "@/core/types";
import type { Schedule, ScheduleRun, CreateScheduleData } from "@/types/schedule";

export class Schedules extends BaseResource {
  async list(agentId: string, options?: RequestOptions): Promise<Schedule[]> {
    return this.client.get<Schedule[]>(`/agents/${agentId}/schedules`, options);
  }

  async retrieve(
    agentId: string,
    scheduleId: string,
    options?: RequestOptions,
  ): Promise<Schedule> {
    return this.client.get<Schedule>(`/agents/${agentId}/schedules/${scheduleId}`, options);
  }

  async create(
    agentId: string,
    data: CreateScheduleData,
    options?: RequestOptions,
  ): Promise<Schedule> {
    return this.client.post<Schedule>(`/agents/${agentId}/schedules`, data, options);
  }

  async update(
    agentId: string,
    scheduleId: string,
    data: Partial<CreateScheduleData>,
    options?: RequestOptions,
  ): Promise<Schedule> {
    return this.client.put<Schedule>(
      `/agents/${agentId}/schedules/${scheduleId}`,
      data,
      options,
    );
  }

  async delete(
    agentId: string,
    scheduleId: string,
    options?: RequestOptions,
  ): Promise<void> {
    return this.client.delete(`/agents/${agentId}/schedules/${scheduleId}`, options);
  }

  async trigger(
    agentId: string,
    scheduleId: string,
    options?: RequestOptions,
  ): Promise<void> {
    await this.client.post(`/agents/${agentId}/schedules/${scheduleId}/trigger`, undefined, options);
  }

  async runs(
    agentId: string,
    scheduleId: string,
    query?: { limit?: number },
    options?: RequestOptions,
  ): Promise<ScheduleRun[]> {
    return this.client.get<ScheduleRun[]>(
      `/agents/${agentId}/schedules/${scheduleId}/runs`,
      { ...options, query: { ...options?.query, ...query } },
    );
  }
}
