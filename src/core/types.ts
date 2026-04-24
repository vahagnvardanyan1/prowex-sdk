export interface ProwexOptions {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface RequestOptions {
  signal?: AbortSignal;
  headers?: Record<string, string>;
  timeout?: number;
  query?: Record<string, string | number | boolean | undefined>;
}
