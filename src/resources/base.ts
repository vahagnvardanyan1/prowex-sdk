import type { HttpClient } from "@/core/http-client";

export abstract class BaseResource {
  protected readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }
}
