import { http, HttpResponse } from "msw";

const BASE = "https://api.prowex.ai";

const mockAgent = {
  id: "agent-1",
  name: "Test Agent",
  description: "A test agent",
  provider: "anthropic",
  model: "claude-sonnet-4-6",
  systemPrompt: "You are a test agent.",
  tools: ["calculator"],
  config: { temperature: 0.7, maxTokens: 1024 },
  maxIterations: 10,
  version: 1,
  status: "active",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

const mockConversation = {
  id: "conv-1",
  agentId: "agent-1",
  title: "Test conversation",
  status: "active",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

const mockMessage = {
  id: "msg-1",
  role: "assistant",
  content: "Hello!",
  createdAt: "2025-01-01T00:00:00Z",
};

const mockTool = {
  id: "tool-1",
  name: "calculator",
  displayName: "Calculator",
  description: "Does math",
  category: "utility",
  type: "builtin",
  inputSchema: {},
  enabled: true,
};

const mockSchedule = {
  id: "sched-1",
  agentId: "agent-1",
  cronExpression: "0 * * * *",
  inputMessage: "Run hourly",
  enabled: true,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

const mockChannel = {
  id: "chan-1",
  type: "telegram",
  label: "Test Bot",
  identifier: "@testbot",
  isActive: true,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

export const handlers = [
  // Agents
  http.get(`${BASE}/agents`, () => HttpResponse.json([mockAgent])),
  http.get(`${BASE}/agents/:id`, () => HttpResponse.json(mockAgent)),
  http.post(`${BASE}/agents`, () => HttpResponse.json(mockAgent, { status: 201 })),
  http.put(`${BASE}/agents/:id`, () => HttpResponse.json(mockAgent)),
  http.delete(`${BASE}/agents/:id`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${BASE}/agents/:id/clone`, () => HttpResponse.json(mockAgent, { status: 201 })),
  http.post(`${BASE}/agents/generate`, () =>
    HttpResponse.json({ agentConfig: { name: "Gen" }, suggestedTools: [] }),
  ),
  http.post(`${BASE}/agents/generate-prompt`, () =>
    HttpResponse.json({ systemPrompt: "Generated prompt" }),
  ),
  http.get(`${BASE}/agents/meta/tools`, () => HttpResponse.json(["calculator", "web_search"])),

  // Conversations
  http.post(`${BASE}/conversations`, () =>
    HttpResponse.json(mockConversation, { status: 201 }),
  ),
  http.get(`${BASE}/conversations/agent/:agentId`, () =>
    HttpResponse.json([mockConversation]),
  ),
  http.get(`${BASE}/conversations/:id/messages`, () =>
    HttpResponse.json([mockMessage]),
  ),
  http.get(`${BASE}/conversations/:id/usage`, () =>
    HttpResponse.json({
      conversationId: "conv-1",
      totalTokens: 100,
      promptTokens: 50,
      completionTokens: 50,
      estimatedCostUsd: 0.01,
      turns: 1,
    }),
  ),
  http.post(`${BASE}/conversations/:id/messages`, ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get("stream") === "true") {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              'data: {"type":"agent.message","content":[{"type":"text","text":"Hi"}]}\n\n',
            ),
          );
          controller.enqueue(
            encoder.encode(
              'data: {"type":"backend.done","model":"claude-sonnet-4-6"}\n\n',
            ),
          );
          controller.close();
        },
      });
      return new HttpResponse(stream, {
        headers: { "Content-Type": "text/event-stream" },
      });
    }
    return HttpResponse.json({ response: "Hello!" });
  }),
  http.post(`${BASE}/conversations/:id/resume`, () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            'data: {"type":"agent.message","content":[{"type":"text","text":"Resumed"}]}\n\n',
          ),
        );
        controller.enqueue(
          encoder.encode('data: {"type":"backend.done"}\n\n'),
        );
        controller.close();
      },
    });
    return new HttpResponse(stream, {
      headers: { "Content-Type": "text/event-stream" },
    });
  }),
  http.delete(`${BASE}/conversations/:id`, () =>
    new HttpResponse(null, { status: 204 }),
  ),

  // Tools
  http.get(`${BASE}/tools`, () => HttpResponse.json([mockTool])),
  http.get(`${BASE}/tools/:name`, () => HttpResponse.json(mockTool)),
  http.post(`${BASE}/tools`, () => HttpResponse.json(mockTool, { status: 201 })),
  http.put(`${BASE}/tools/:id`, () => HttpResponse.json(mockTool)),
  http.delete(`${BASE}/tools/:id`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${BASE}/tools/:name/secrets`, () =>
    HttpResponse.json({ ok: true }, { status: 201 }),
  ),
  http.get(`${BASE}/tools/:name/secrets`, () =>
    HttpResponse.json({ toolName: "calculator", keys: ["API_KEY"] }),
  ),
  http.delete(`${BASE}/tools/:name/secrets/:key`, () =>
    new HttpResponse(null, { status: 204 }),
  ),

  // Schedules
  http.get(`${BASE}/agents/:agentId/schedules`, () =>
    HttpResponse.json([mockSchedule]),
  ),
  http.get(`${BASE}/agents/:agentId/schedules/:scheduleId`, () =>
    HttpResponse.json(mockSchedule),
  ),
  http.post(`${BASE}/agents/:agentId/schedules`, () =>
    HttpResponse.json(mockSchedule, { status: 201 }),
  ),
  http.put(`${BASE}/agents/:agentId/schedules/:scheduleId`, () =>
    HttpResponse.json(mockSchedule),
  ),
  http.delete(`${BASE}/agents/:agentId/schedules/:scheduleId`, () =>
    new HttpResponse(null, { status: 204 }),
  ),
  http.post(`${BASE}/agents/:agentId/schedules/:scheduleId/trigger`, () =>
    HttpResponse.json({ ok: true }),
  ),
  http.get(`${BASE}/agents/:agentId/schedules/:scheduleId/runs`, () =>
    HttpResponse.json([]),
  ),

  // Channels
  http.get(`${BASE}/channels`, () => HttpResponse.json([mockChannel])),
  http.get(`${BASE}/channels/:id`, () => HttpResponse.json(mockChannel)),
  http.delete(`${BASE}/channels/:id`, () =>
    new HttpResponse(null, { status: 204 }),
  ),
  http.post(`${BASE}/channels/link/telegram`, () =>
    HttpResponse.json({ linkToken: "tok", deepLink: "https://t.me/bot?start=tok" }, { status: 201 }),
  ),

  // Knowledge
  http.get(`${BASE}/knowledge`, () => HttpResponse.json([])),
  http.post(`${BASE}/knowledge`, () =>
    HttpResponse.json({ id: "kb-1", name: "Test KB" }, { status: 201 }),
  ),
  http.post(`${BASE}/knowledge/:kbId/documents`, () =>
    HttpResponse.json({ documentId: "doc-1", status: "ok" }),
  ),
  http.delete(`${BASE}/knowledge/:id`, () =>
    new HttpResponse(null, { status: 204 }),
  ),

  // Analytics
  http.get(`${BASE}/analytics/dashboard`, () =>
    HttpResponse.json({
      totalInputTokens: 1000,
      totalOutputTokens: 500,
      totalCost: 0.05,
      totalCalls: 10,
      avgLatencyMs: 200,
    }),
  ),
  http.get(`${BASE}/analytics/daily`, () => HttpResponse.json([])),
  http.get(`${BASE}/analytics/by-agent`, () => HttpResponse.json([])),
  http.get(`${BASE}/analytics/by-model`, () => HttpResponse.json([])),

  // MCP
  http.get(`${BASE}/tools/mcp/servers`, () => HttpResponse.json([])),
  http.post(`${BASE}/tools/mcp/servers`, () =>
    HttpResponse.json({ discoveredTools: ["tool1"] }),
  ),
  http.delete(`${BASE}/tools/mcp/servers/:name`, () =>
    new HttpResponse(null, { status: 204 }),
  ),
  http.get(`${BASE}/mcp`, () => HttpResponse.json([])),
  http.get(`${BASE}/mcp/:name/tools`, () =>
    HttpResponse.json({ server: "test", tools: [] }),
  ),

  // Skills
  http.get(`${BASE}/skills`, () =>
    HttpResponse.json([{ id: "deep-research", name: "Deep Research", description: "Research", category: "research" }]),
  ),
  http.get(`${BASE}/skills/:id`, () =>
    HttpResponse.json({ id: "deep-research", name: "Deep Research", description: "Research", category: "research" }),
  ),
];
