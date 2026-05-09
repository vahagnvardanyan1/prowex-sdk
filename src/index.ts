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
export { Knowledge } from "@/resources/knowledge";
export { Analytics } from "@/resources/analytics";
export { Skills } from "@/resources/skills";
