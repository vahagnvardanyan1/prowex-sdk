export interface Schedule {
  id: string;
  agentId: string;
  cronExpression: string;
  inputMessage: string;
  channelId?: string | null;
  enabled: boolean;
  lastRunAt?: string | null;
  lastRunStatus?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleRun {
  id: string;
  scheduleId: string;
  status: string;
  startedAt: string;
  finishedAt?: string | null;
  duration?: number | null;
  error?: string | null;
}

export interface CreateScheduleData {
  cronExpression: string;
  inputMessage: string;
  channelId?: string;
  enabled?: boolean;
}
