import type { ProviderName, AgentStatus, AgentMode, AgentType, EmbeddingProviderName } from "@/types/enums";

export interface AgentConfig {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
}

export interface AgentSuggestion {
  title: string;
  prompt: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  provider: ProviderName;
  model: string;
  systemPrompt: string;
  tools: string[];
  skillIds?: string[];
  mode?: AgentMode;
  type?: AgentType;
  isOwner?: boolean;
  config: AgentConfig;
  maxIterations: number;
  version: number;
  status: AgentStatus;
  rating?: number;
  ratingCount?: number;
  builtInSlug?: string | null;
  isBuiltIn?: boolean;
  isUserModified?: boolean;
  updateAvailable?: boolean;
  imageUrl?: string | null;
  videoUrl?: string | null;
  marketplaceStatus?: string;
  category?: string;
  installCount?: number;
  shortDescription?: string | null;
  tags?: string[];
  suggestions?: AgentSuggestion[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  embeddingProvider: EmbeddingProviderName;
  chunkSize: number;
  chunkOverlap: number;
  documentCount: number;
  chunkCount: number;
}

export interface ToolDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  type: string;
  inputSchema: Record<string, unknown>;
  enabled: boolean;
}

export interface SkillSummary {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface PublicAgent {
  id: string;
  name: string;
  description: string;
  provider: ProviderName;
  model: string;
  tools: string[];
  skills: SkillSummary[];
  status: AgentStatus;
  builtInSlug?: string | null;
  isBuiltIn: boolean;
  imageUrl?: string | null;
  videoUrl?: string | null;
  type: string;
  marketplaceStatus?: string;
  category?: string;
  installCount?: number;
  rating?: number;
  ratingCount?: number;
  shortDescription?: string | null;
  tags?: string[];
  createdAt: string;
}

export interface UpdateAgentPayload {
  name: string;
  provider: ProviderName;
  model: string;
  description?: string;
  systemPrompt?: string;
  tools?: string[];
  config?: AgentConfig;
  maxIterations?: number;
  suggestions?: AgentSuggestion[] | null;
}

export interface CreateBetaAgentPayload {
  name: string;
  model: string;
  system?: string;
  description?: string;
  tools?: string[];
  skillIds?: string[];
  metadata?: Record<string, unknown>;
  suggestions?: AgentSuggestion[] | null;
}

export interface GeneratedConfig {
  name: string;
  description: string;
  provider?: string;
  model: string;
  systemPrompt: string;
  tools: string[];
  config: { temperature: number; maxTokens: number };
  maxIterations: number;
}

export interface SuggestedTool {
  name: string;
  description: string;
  reason: string;
}
