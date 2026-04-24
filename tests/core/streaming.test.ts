import { describe, it, expect, vi } from "vitest";
import { parseSSE, ConversationStream } from "../../src/core/streaming";
import type { StreamEvent } from "../../src/types/stream";

function createSSEResponse(lines: string[]): Response {
  const encoder = new TextEncoder();
  const data = lines.join("\n") + "\n";
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(data));
      controller.close();
    },
  });
  return new Response(stream);
}

describe("parseSSE", () => {
  it("parses SSE data lines into events", async () => {
    const response = createSSEResponse([
      'data: {"type":"backend.done","model":"test"}',
      "",
    ]);
    const events: StreamEvent[] = [];
    for await (const event of parseSSE(response)) {
      events.push(event);
    }
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("backend.done");
  });

  it("ignores non-data lines", async () => {
    const response = createSSEResponse([
      ": this is a comment",
      "event: keep-alive",
      'data: {"type":"backend.done"}',
      "",
    ]);
    const events: StreamEvent[] = [];
    for await (const event of parseSSE(response)) {
      events.push(event);
    }
    expect(events).toHaveLength(1);
  });

  it("skips malformed JSON", async () => {
    const response = createSSEResponse([
      "data: not json",
      'data: {"type":"backend.done"}',
      "",
    ]);
    const events: StreamEvent[] = [];
    for await (const event of parseSSE(response)) {
      events.push(event);
    }
    expect(events).toHaveLength(1);
  });
});

describe("ConversationStream", () => {
  function createStream(lines: string[]) {
    const response = createSSEResponse(lines);
    const controller = new AbortController();
    return new ConversationStream(response, controller);
  }

  it("iterates over events", async () => {
    const stream = createStream([
      'data: {"type":"agent.message","content":[{"type":"text","text":"Hello"}]}',
      'data: {"type":"backend.done","model":"test"}',
      "",
    ]);
    const events: StreamEvent[] = [];
    for await (const event of stream) {
      events.push(event);
    }
    expect(events).toHaveLength(2);
  });

  it("accumulates text in finalText()", async () => {
    const stream = createStream([
      'data: {"type":"agent.message","content":[{"type":"text","text":"Hello "}]}',
      'data: {"type":"agent.message","content":[{"type":"text","text":"World"}]}',
      'data: {"type":"backend.done"}',
      "",
    ]);
    const text = await stream.finalText();
    expect(text).toBe("Hello World");
  });

  it("returns finalMessage()", async () => {
    const stream = createStream([
      'data: {"type":"backend.done","model":"claude-sonnet-4-6","latencyMs":150}',
      "",
    ]);
    const done = await stream.finalMessage();
    expect(done).not.toBeNull();
    expect(done?.type).toBe("backend.done");
  });

  it("emits events via .on()", async () => {
    const stream = createStream([
      'data: {"type":"backend.done","model":"test"}',
      "",
    ]);
    const handler = vi.fn();
    stream.on("backend.done", handler);
    for await (const _ of stream) {
      // consume
    }
    expect(handler).toHaveBeenCalledOnce();
  });

  it("can abort", async () => {
    const stream = createStream([
      'data: {"type":"backend.done"}',
      "",
    ]);
    stream.abort();
    const events: StreamEvent[] = [];
    for await (const event of stream) {
      events.push(event);
    }
    expect(events).toHaveLength(0);
  });

  it("provides toReadableStream()", async () => {
    const stream = createStream([
      'data: {"type":"backend.done"}',
      "",
    ]);
    const readable = stream.toReadableStream();
    const reader = readable.getReader();
    const { value, done } = await reader.read();
    expect(done).toBe(false);
    expect(value?.type).toBe("backend.done");
    const next = await reader.read();
    expect(next.done).toBe(true);
  });
});
