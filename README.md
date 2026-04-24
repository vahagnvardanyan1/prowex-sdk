# @prowex/sdk

Official Node.js & browser SDK for the [Prowex](https://prowex.ai) platform.

## Installation

```bash
npm install @prowex/sdk
```

## Quick Start 

```ts
import Prowex from "@prowex/sdk";

const prowex = new Prowex({
  apiKey: "your-api-key",
  baseURL: "https://api.prowex.ai", // optional
});

// List agents
const agents = await prowex.agents.list();

// Create an agent
const agent = await prowex.agents.create({
  name: "My Agent",
  model: "claude-sonnet-4-6",
});

// Send a message
const conv = await prowex.conversations.create(agent.id);
const reply = await prowex.conversations.sendMessage(conv.id, "Hello!");
console.log(reply.response);
```

## Streaming

```ts
const stream = await prowex.conversations.stream(conv.id, "Tell me a joke");

for await (const event of stream) {
  console.log(event.type);
}

// Get the full accumulated text
console.log(await stream.finalText());

// Or use event handlers
const stream2 = await prowex.conversations.stream(conv.id, "Hello");
stream2.on("agent.message", (event) => {
  console.log(event.content);
});
for await (const _ of stream2) {
  // consume
}
```

## Resources

| Resource | Methods |
|----------|---------|
| `prowex.agents` | `list` `retrieve` `create` `update` `delete` `clone` `generate` `generatePrompt` `availableTools` `toolDefinitions` `uploadResource` |
| `prowex.conversations` | `create` `list` `messages` `usage` `sendMessage` `stream` `resumeStream` `uploadAttachment` `delete` |
| `prowex.tools` | `list` `retrieve` `create` `update` `delete` + `secrets.set` `secrets.list` `secrets.delete` |
| `prowex.schedules` | `list` `retrieve` `create` `update` `delete` `trigger` `runs` |
| `prowex.channels` | `list` `retrieve` `delete` + `telegram.generateLink` |
| `prowex.knowledge` | `list` `create` `addDocument` `delete` |
| `prowex.analytics` | `dashboard` `daily` `byAgent` `byModel` |
| `prowex.mcp` | `list` `connect` `disconnect` `listBuiltin` `builtinTools` `sendMessage` |
| `prowex.skills` | `list` `retrieve` |

## Configuration

```ts
const prowex = new Prowex({
  apiKey: "your-api-key",  // required — sent as x-api-key header
  baseURL: "https://...",  // default: https://api.prowex.ai
  timeout: 60000,          // default: 60s
  maxRetries: 2,           // default: 2 (retries on 408/429/5xx)
});
```

## Error Handling

```ts
import { NotFoundError, AuthenticationError, RateLimitError } from "@prowex/sdk";

try {
  await prowex.agents.retrieve("non-existent");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Agent not found");
  } else if (error instanceof AuthenticationError) {
    console.log("Invalid API key");
  } else if (error instanceof RateLimitError) {
    console.log("Rate limited — retry later");
  }
}
```

All error classes: `BadRequestError` (400), `AuthenticationError` (401), `PermissionDeniedError` (403), `NotFoundError` (404), `ConflictError` (409), `ValidationError` (422), `RateLimitError` (429), `InternalServerError` (5xx), `ConnectionError`, `TimeoutError`.

## Types-Only Import

Import types without any runtime code:

```ts
import type { Agent, StreamEvent, Conversation } from "@prowex/sdk/types";
```

## License

MIT
