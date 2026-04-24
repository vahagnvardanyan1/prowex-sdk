import type { StreamEvent } from "@/types/stream";

export interface Conversation {
  id: string;
  agentId: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageAttachmentRef {
  file_id: string;
  filename: string;
  mount_path: string;
  uploadedAt: string;
  fileUploadId?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolName?: string | null;
  model?: string | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
  createdAt: string;
  attachments?: ChatMessageAttachmentRef[] | null;
}

export interface PlanStepInfo {
  description: string;
  tool: string;
  expectedOutput: string;
  status: "pending" | "active" | "done" | "failed";
  attempts: number;
}

export interface StreamCallbacks {
  onEvent: (event: StreamEvent) => void;
}
