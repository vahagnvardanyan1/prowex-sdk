import type { StreamEvent, AgentMessageEvent, BackendDoneEvent } from "@/types/stream";
import { EventType } from "@/types/stream";

export async function* parseSSE(
  response: Response,
  signal?: AbortSignal,
): AsyncGenerator<StreamEvent> {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const event = JSON.parse(line.slice(6)) as StreamEvent;
          yield event;
        } catch {
          // ignore parse errors
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

type EventHandler<T> = (event: T) => void;

export class ConversationStream implements AsyncIterable<StreamEvent> {
  private readonly response: Response;
  private readonly controller: AbortController;
  private readonly handlers = new Map<string, EventHandler<StreamEvent>[]>();
  private _events: StreamEvent[] = [];
  private _fullText = "";
  private _done: BackendDoneEvent | null = null;
  private _consumed = false;

  constructor(response: Response, controller: AbortController) {
    this.response = response;
    this.controller = controller;
  }

  on<K extends StreamEvent["type"]>(
    type: K,
    handler: EventHandler<Extract<StreamEvent, { type: K }>>,
  ): this {
    const handlers = this.handlers.get(type) ?? [];
    handlers.push(handler as EventHandler<StreamEvent>);
    this.handlers.set(type, handlers);
    return this;
  }

  async *[Symbol.asyncIterator](): AsyncIterator<StreamEvent> {
    if (this._consumed) {
      for (const event of this._events) {
        yield event;
      }
      return;
    }

    this._consumed = true;
    for await (const event of parseSSE(this.response, this.controller.signal)) {
      this._events.push(event);
      this.emit(event);

      if (event.type === EventType.AgentMessage) {
        const msg = event as AgentMessageEvent;
        for (const block of msg.content) {
          if (block.type === "text") {
            this._fullText += block.text;
          }
        }
      }

      if (event.type === EventType.BackendDone) {
        this._done = event as BackendDoneEvent;
      }

      yield event;
    }
  }

  async finalText(): Promise<string> {
    await this.consume();
    return this._fullText;
  }

  async finalMessage(): Promise<BackendDoneEvent | null> {
    await this.consume();
    return this._done;
  }

  abort(): void {
    this.controller.abort();
  }

  toReadableStream(): ReadableStream<StreamEvent> {
    const iter = this[Symbol.asyncIterator]();
    return new ReadableStream<StreamEvent>({
      async pull(controller) {
        const { done, value } = await iter.next();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
      cancel: () => {
        this.abort();
      },
    });
  }

  private emit(event: StreamEvent): void {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  private async consume(): Promise<void> {
    if (this._consumed && this._events.length > 0) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _event of this) {
      // consume all events
    }
  }
}
