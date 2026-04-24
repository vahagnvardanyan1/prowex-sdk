import { Prowex } from "@/client";
export { Prowex };
export default Prowex;

// Core
export type { ProwexOptions, RequestOptions } from "@/core/types";
export type { Page } from "@/core/pagination";
export {
  ProwexError,
  APIError,
  BadRequestError,
  AuthenticationError,
  PermissionDeniedError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalServerError,
  ConnectionError,
  TimeoutError,
} from "@/core/errors";
export { ConversationStream, parseSSE } from "@/core/streaming";

// Re-export all types
export * from "@/types/index";

// Resources (for advanced use)
export { Agents } from "@/resources/agents";
export { Conversations } from "@/resources/conversations";
export { Tools } from "@/resources/tools";
export { Schedules } from "@/resources/schedules";
export { Channels } from "@/resources/channels";
export { Knowledge } from "@/resources/knowledge";
export { Analytics } from "@/resources/analytics";
export { Mcp } from "@/resources/mcp";
export { Skills } from "@/resources/skills";
