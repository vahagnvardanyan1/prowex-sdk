import { BaseResource } from "@/resources/base";
import { ConversationStream } from "@/core/streaming";
import type { RequestOptions } from "@/core/types";
import type { Conversation, ChatMessage } from "@/types/conversation";
import type { ConversationAttachment } from "@/types/chat";

export class Conversations extends BaseResource {
  async create({
    agentId,
    options,
  }: {
    agentId: string;
    options?: RequestOptions;
  }): Promise<Conversation> {
    return this.client.post<Conversation>("/conversations", { agentId }, options);
  }

  async list({
    agentId,
    options,
  }: {
    agentId: string;
    options?: RequestOptions;
  }): Promise<Conversation[]> {
    return this.client.get<Conversation[]>(`/conversations/agent/${agentId}`, options);
  }

  async messages({
    conversationId,
    options,
  }: {
    conversationId: string;
    options?: RequestOptions;
  }): Promise<ChatMessage[]> {
    return this.client.get<ChatMessage[]>(`/conversations/${conversationId}/messages`, options);
  }

  async usage({
    conversationId,
    options,
  }: {
    conversationId: string;
    options?: RequestOptions;
  }): Promise<{
    conversationId: string;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    estimatedCostUsd: number;
    turns: number;
  }> {
    return this.client.get(`/conversations/${conversationId}/usage`, options);
  }

  async sendMessage({
    conversationId,
    message,
    attachmentIds,
    options,
  }: {
    conversationId: string;
    message: string;
    attachmentIds?: string[];
    options?: RequestOptions;
  }): Promise<{ response: string }> {
    const body: Record<string, unknown> = { message };
    if (attachmentIds?.length) body.attachmentIds = attachmentIds;
    return this.client.post(`/conversations/${conversationId}/messages`, body, options);
  }

  async stream({
    conversationId,
    message,
    attachmentIds,
    options,
  }: {
    conversationId: string;
    message: string;
    attachmentIds?: string[];
    options?: RequestOptions;
  }): Promise<ConversationStream> {
    const body: Record<string, unknown> = { message };
    if (attachmentIds?.length) body.attachmentIds = attachmentIds;
    const controller = new AbortController();
    if (options?.signal) {
      options.signal.addEventListener("abort", () => controller.abort());
    }
    const response = await this.client.stream(`/conversations/${conversationId}/messages`, body, {
      ...options,
      query: { ...options?.query, stream: "true" },
      signal: controller.signal,
    });
    return new ConversationStream(response, controller);
  }

  async resumeStream({
    conversationId,
    response,
    options,
  }: {
    conversationId: string;
    response: string;
    options?: RequestOptions;
  }): Promise<ConversationStream> {
    const controller = new AbortController();
    if (options?.signal) {
      options.signal.addEventListener("abort", () => controller.abort());
    }
    const res = await this.client.stream(
      `/conversations/${conversationId}/resume`,
      { response },
      { ...options, signal: controller.signal },
    );
    return new ConversationStream(res, controller);
  }

  async uploadAttachment({
    conversationId,
    file,
    filename,
    options,
  }: {
    conversationId: string;
    file: Blob;
    filename: string;
    options?: RequestOptions;
  }): Promise<ConversationAttachment> {
    const formData = new FormData();
    formData.append("file", file, filename);
    return this.client.postFormData<ConversationAttachment>(
      `/conversations/${conversationId}/attachments`,
      formData,
      options,
    );
  }

  async delete({
    conversationId,
    options,
  }: {
    conversationId: string;
    options?: RequestOptions;
  }): Promise<void> {
    return this.client.delete(`/conversations/${conversationId}`, options);
  }
}
