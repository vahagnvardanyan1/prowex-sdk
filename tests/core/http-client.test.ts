import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { HttpClient } from "../../src/core/http-client";
import {
  NotFoundError,
  AuthenticationError,
  BadRequestError,
  TimeoutError,
} from "../../src/core/errors";
import { server } from "../mocks/server";

const BASE = "https://api.prowex.ai";

const createClient = (overrides?: Partial<{ timeout: number; maxRetries: number }>) =>
  new HttpClient({
    apiKey: "test-key",
    baseURL: BASE,
    ...overrides,
  });

describe("HttpClient", () => {
  it("sends x-api-key header", async () => {
    let capturedHeaders: Headers | undefined;
    server.use(
      http.get(`${BASE}/test`, ({ request }) => {
        capturedHeaders = request.headers;
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createClient();
    await client.get("/test");
    expect(capturedHeaders?.get("x-api-key")).toBe("test-key");
  });

  it("sends User-Agent header", async () => {
    let capturedHeaders: Headers | undefined;
    server.use(
      http.get(`${BASE}/test`, ({ request }) => {
        capturedHeaders = request.headers;
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createClient();
    await client.get("/test");
    expect(capturedHeaders?.get("user-agent")).toContain("@prowex/sdk/");
  });

  it("returns parsed JSON for GET", async () => {
    server.use(
      http.get(`${BASE}/data`, () => HttpResponse.json({ id: 1, name: "test" })),
    );

    const client = createClient();
    const result = await client.get<{ id: number; name: string }>("/data");
    expect(result).toEqual({ id: 1, name: "test" });
  });

  it("sends JSON body for POST", async () => {
    let capturedBody: unknown;
    server.use(
      http.post(`${BASE}/data`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({ ok: true }, { status: 201 });
      }),
    );

    const client = createClient();
    await client.post("/data", { name: "test" });
    expect(capturedBody).toEqual({ name: "test" });
  });

  it("throws NotFoundError for 404", async () => {
    server.use(
      http.get(`${BASE}/missing`, () =>
        HttpResponse.json({ message: "Not found" }, { status: 404 }),
      ),
    );

    const client = createClient({ maxRetries: 0 });
    await expect(client.get("/missing")).rejects.toThrow(NotFoundError);
  });

  it("throws AuthenticationError for 401", async () => {
    server.use(
      http.get(`${BASE}/protected`, () =>
        HttpResponse.json({ message: "Invalid API key" }, { status: 401 }),
      ),
    );

    const client = createClient({ maxRetries: 0 });
    await expect(client.get("/protected")).rejects.toThrow(AuthenticationError);
  });

  it("throws BadRequestError for 400", async () => {
    server.use(
      http.post(`${BASE}/bad`, () =>
        HttpResponse.json({ message: "Invalid input" }, { status: 400 }),
      ),
    );

    const client = createClient({ maxRetries: 0 });
    await expect(client.post("/bad", {})).rejects.toThrow(BadRequestError);
  });

  it("retries on 500 and eventually succeeds", async () => {
    let attempts = 0;
    server.use(
      http.get(`${BASE}/flaky`, () => {
        attempts++;
        if (attempts < 2) {
          return HttpResponse.json({ message: "Server error" }, { status: 500 });
        }
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createClient({ maxRetries: 2 });
    const result = await client.get<{ ok: boolean }>("/flaky");
    expect(result.ok).toBe(true);
    expect(attempts).toBe(2);
  });

  it("handles DELETE with 204", async () => {
    server.use(
      http.delete(`${BASE}/item/1`, () => new HttpResponse(null, { status: 204 })),
    );

    const client = createClient();
    await expect(client.delete("/item/1")).resolves.toBeUndefined();
  });

  it("appends query parameters", async () => {
    let capturedUrl = "";
    server.use(
      http.get(`${BASE}/search`, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([]);
      }),
    );

    const client = createClient();
    await client.get("/search", { query: { category: "code", limit: 10 } });
    const url = new URL(capturedUrl);
    expect(url.searchParams.get("category")).toBe("code");
    expect(url.searchParams.get("limit")).toBe("10");
  });
});
