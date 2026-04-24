export enum ProviderName {
  Anthropic = "anthropic",
}

export enum AgentMode {
  Execute = "execute",
  Research = "research",
  Review = "review",
}

export enum AgentType {
  General = "general",
  User = "user",
}

export enum AgentStatus {
  Active = "active",
  Paused = "paused",
  Archived = "archived",
}

export enum ConversationStatus {
  Active = "active",
  Archived = "archived",
}

export enum EmbeddingProviderName {
  OpenAI = "openai",
  Google = "google",
}

export enum MessageRole {
  User = "user",
  Assistant = "assistant",
  System = "system",
  Tool = "tool",
}

export enum ToolType {
  Builtin = "builtin",
  Custom = "custom",
  Mcp = "mcp",
}

export enum ToolCategory {
  Search = "search",
  Code = "code",
  Data = "data",
  Utility = "utility",
  Analysis = "analysis",
  Finance = "finance",
  Fashion = "fashion",
  Memory = "memory",
}
