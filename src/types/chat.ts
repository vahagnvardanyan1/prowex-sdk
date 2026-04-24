import type { PlanStepInfo } from "@/types/conversation";

export interface AgentMedia {
  video: string;
  image: string;
}

export interface ToolResult {
  toolName: string;
  result: string;
}

export interface CompletedTool {
  toolName: string;
  result: string;
  isError?: boolean;
}

export interface MessageAttachment {
  id: string;
  type: "image" | "document" | "file";
  name: string;
  contentType?: string;
  content: { type: string; text?: string; image?: string }[];
  metadata?: { file_id: string; fileUploadId?: string };
}

export interface Message {
  role: "user" | "assistant" | "tool_status";
  content: string;
  toolResults?: ToolResult[];
  createdAt?: string;
  attachments?: MessageAttachment[];
}

export interface InterruptData {
  question: string;
  options?: string[];
  plan?: PlanStepInfo[];
}

export interface ToolTimelineStep {
  id: string;
  toolName: string;
  args?: string;
  status: "running" | "done" | "error";
  result?: string;
  resultSummary?: string;
  duration?: number;
}

export interface ToolResultInfo {
  result: string;
  isError: boolean;
}

export interface ConversationAttachment {
  file_id: string;
  mount_path: string;
  filename: string;
  uploadedAt: string;
  fileUploadId?: string;
}

export interface ProgressStep {
  label: string;
  status: "completed" | "in_progress" | "pending";
}

export interface FileReference {
  filename: string;
  ext: string;
  action: "read" | "write" | "edit";
}
