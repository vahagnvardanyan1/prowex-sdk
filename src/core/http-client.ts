import { APIError, ConnectionError, TimeoutError } from "@/core/errors";
import type { ProwexOptions, RequestOptions } from "@/core/types";

const VERSION = "0.0.0";
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);
const DEFAULT_TIMEOUT = 60_000;
const DEFAULT_MAX_RETRIES = 2;

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly maxRetries: number;

  constructor(options: ProwexOptions) {
    this.apiKey = options.apiKey;
    this.baseURL = (options.baseURL ?? "https://api.prowex.ai").replace(/\/$/, "");
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, body, options);
  }

  async delete(path: string, options?: RequestOptions): Promise<void> {
    await this.rawRequest("DELETE", path, undefined, options);
  }

  async stream(path: string, body?: unknown, options?: RequestOptions): Promise<Response> {
    return this.rawRequest("POST", path, body, options);
  }

  async postFormData<T>(path: string, formData: FormData, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(path, options?.query);
    const headers: Record<string, string> = {
      "x-api-key": this.apiKey,
      "User-Agent": `@prowex/sdk/${VERSION}`,
      ...options?.headers,
    };
    const timeout = options?.timeout ?? this.timeout;
    const signal = options?.signal ?? AbortSignal.timeout(timeout);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
      signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw APIError.fromResponse(response.status, body, response.headers);
    }

    return response.json() as Promise<T>;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const response = await this.rawRequest(method, path, body, options);
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  private async rawRequest(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<Response> {
    const url = this.buildURL(path, options?.query);
    const headers: Record<string, string> = {
      "x-api-key": this.apiKey,
      "User-Agent": `@prowex/sdk/${VERSION}`,
      ...options?.headers,
    };
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const timeout = options?.timeout ?? this.timeout;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        await this.sleep(this.getRetryDelay(attempt, lastError));
      }

      const signal = options?.signal ?? AbortSignal.timeout(timeout);

      try {
        const response = await fetch(url, {
          method,
          headers,
          body: body !== undefined ? JSON.stringify(body) : undefined,
          signal,
        });

        if (response.ok || !this.shouldRetry(response.status, attempt)) {
          if (!response.ok) {
            const responseBody = await response.json().catch(() => null);
            throw APIError.fromResponse(response.status, responseBody, response.headers);
          }
          return response;
        }

        const retryAfter = response.headers.get("Retry-After");
        lastError = new APIError(
          response.status,
          await response.json().catch(() => null),
          response.headers,
        );
        if (retryAfter) {
          (lastError as APIError & { retryAfter?: string }).retryAfter = retryAfter;
        }
      } catch (error) {
        if (error instanceof APIError) {
          if (!RETRYABLE_STATUS_CODES.has(error.status) || attempt >= this.maxRetries) {
            throw error;
          }
          lastError = error;
          continue;
        }
        if (error instanceof DOMException && error.name === "AbortError") {
          if (options?.signal?.aborted) throw error;
          throw new TimeoutError(`Request timed out after ${timeout}ms`);
        }
        if (error instanceof TypeError) {
          throw new ConnectionError(error.message);
        }
        throw error;
      }
    }

    throw lastError!;
  }

  private buildURL(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = new URL(path, this.baseURL);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private shouldRetry(status: number, attempt: number): boolean {
    return RETRYABLE_STATUS_CODES.has(status) && attempt < this.maxRetries;
  }

  private getRetryDelay(attempt: number, error?: Error): number {
    if (error && "retryAfter" in error) {
      const retryAfter = (error as { retryAfter?: string }).retryAfter;
      if (retryAfter) {
        const seconds = Number(retryAfter);
        if (!isNaN(seconds)) return seconds * 1000;
        const date = new Date(retryAfter).getTime();
        if (!isNaN(date)) return Math.max(0, date - Date.now());
      }
    }
    return Math.min(1000 * 2 ** (attempt - 1), 30_000) + Math.random() * 500;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
