import type {
  BetaManagedAgentsTextBlock as TextBlock,
  BetaManagedAgentsSessionEvent as SessionEvent,
  BetaManagedAgentsUserMessageEvent as UserMessageEvent,
  BetaManagedAgentsSessionErrorEvent as SessionErrorEvent,
  BetaManagedAgentsAgentToolUseEvent as AgentToolUseEvent,
  BetaManagedAgentsAgentMessageEvent as AgentMessageEvent,
  BetaManagedAgentsAgentThinkingEvent as AgentThinkingEvent,
  BetaManagedAgentsAgentMCPToolUseEvent as MCPToolUseEvent,
  BetaManagedAgentsAgentToolResultEvent as AgentToolResultEvent,
  BetaManagedAgentsAgentMCPToolResultEvent as MCPToolResultEvent,
  BetaManagedAgentsAgentCustomToolUseEvent as CustomToolUseEvent,
  BetaManagedAgentsUserToolConfirmationEvent as UserToolConfirmationEvent,
  BetaManagedAgentsUserCustomToolResultEvent as UserCustomToolResultEvent,
  BetaManagedAgentsAgentThreadContextCompactedEvent as ContextCompactedEvent,
} from "@anthropic-ai/sdk/resources/beta/sessions/events";

export type {
  TextBlock,
  SessionEvent,
  UserMessageEvent,
  SessionErrorEvent,
  MCPToolUseEvent,
  AgentToolUseEvent,
  AgentThinkingEvent,
  AgentMessageEvent,
  MCPToolResultEvent,
  CustomToolUseEvent,
  AgentToolResultEvent,
  ContextCompactedEvent,
  UserToolConfirmationEvent,
  UserCustomToolResultEvent,
};

export const EventType = {
  AgentMessage: "agent.message" satisfies AgentMessageEvent["type"],
  AgentToolUse: "agent.tool_use" satisfies AgentToolUseEvent["type"],
  AgentToolResult: "agent.tool_result" satisfies AgentToolResultEvent["type"],
  AgentThinking: "agent.thinking" satisfies AgentThinkingEvent["type"],
  CustomToolUse: "agent.custom_tool_use" satisfies CustomToolUseEvent["type"],
  MCPToolUse: "agent.mcp_tool_use" satisfies MCPToolUseEvent["type"],
  MCPToolResult: "agent.mcp_tool_result" satisfies MCPToolResultEvent["type"],
  ContextCompacted:
    "agent.thread_context_compacted" satisfies ContextCompactedEvent["type"],
  SessionError: "session.error" satisfies SessionErrorEvent["type"],

  SessionStatusIdle: "session.status_idle" as const,
  SessionStatusRunning: "session.status_running" as const,
  SessionStatusRescheduled: "session.status_rescheduled" as const,
  SessionStatusTerminated: "session.status_terminated" as const,

  SpanModelRequestStart: "span.model_request_start" as const,
  SpanModelRequestEnd: "span.model_request_end" as const,

  BackendDone: "backend.done" as const,
  BackendError: "backend.error" as const,
  BackendCustomToolResult: "backend.custom_tool_result" as const,
  BackendSessionContext: "backend.session_context" as const,
} as const;

// Session lifecycle event types

export type SessionStopReasonType =
  | "end_turn"
  | "requires_action"
  | "retries_exhausted";

export interface SessionStatusIdleEvent {
  type: "session.status_idle";
  stop_reason: { type: SessionStopReasonType };
}

export interface SessionStatusRunningEvent {
  type: "session.status_running";
}

export interface SessionStatusRescheduledEvent {
  type: "session.status_rescheduled";
}

export interface SessionStatusTerminatedEvent {
  type: "session.status_terminated";
}

export interface SessionErrorRetryStatus {
  type: "retrying" | "failed";
}

export interface SessionErrorExtendedPayload {
  message: string;
  type?: string;
  retry_status?: SessionErrorRetryStatus;
}

// Span telemetry event types

export interface SpanModelRequestStartEvent {
  type: "span.model_request_start";
}

export interface SpanModelRequestEndEvent {
  type: "span.model_request_end";
  model_usage?: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
  };
}

// Backend-only event types

export interface BackendSessionContextEvent {
  type: "backend.session_context";
  sessionId: string;
  agentId: string;
  skillIds: string[];
  toolNames: string[];
}

export interface TurnUsage {
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
}

export interface BackendDoneEvent {
  type: "backend.done";
  provider?: string;
  model?: string;
  toolCalls?: string[];
  interrupted?: boolean;
  latencyMs?: number;
  usage?: TurnUsage;
}

export interface BackendErrorEvent {
  type: "backend.error";
  message: string;
  code?: string;
  errorType?: string;
}

export interface BackendCustomToolResultEvent {
  type: "backend.custom_tool_result";
  toolName: string;
  result: string;
  isError: boolean;
}

export type BackendEvent =
  | BackendDoneEvent
  | BackendErrorEvent
  | BackendCustomToolResultEvent
  | BackendSessionContextEvent;

export type SessionLifecycleEvent =
  | SessionStatusIdleEvent
  | SessionStatusRunningEvent
  | SessionStatusRescheduledEvent
  | SessionStatusTerminatedEvent;

export type StreamEvent =
  | SessionEvent
  | SessionLifecycleEvent
  | SpanModelRequestStartEvent
  | SpanModelRequestEndEvent
  | BackendEvent;

export type ToolUseEvent =
  | AgentToolUseEvent
  | CustomToolUseEvent
  | MCPToolUseEvent;

export type SessionStatus =
  | "running"
  | "rescheduled"
  | "idle"
  | "terminated"
  | "error_retrying"
  | null;
