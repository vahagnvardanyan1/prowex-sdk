import { describe, it, expect } from "vitest";
import {
  APIError,
  BadRequestError,
  AuthenticationError,
  PermissionDeniedError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalServerError,
} from "../../src/core/errors";

describe("APIError.fromResponse", () => {
  const headers = new Headers();

  const cases: [number, string][] = [
    [400, "BadRequestError"],
    [401, "AuthenticationError"],
    [403, "PermissionDeniedError"],
    [404, "NotFoundError"],
    [409, "ConflictError"],
    [422, "ValidationError"],
    [429, "RateLimitError"],
    [500, "InternalServerError"],
    [502, "InternalServerError"],
    [503, "InternalServerError"],
  ];

  it.each(cases)("maps status %i to %s", (status, expectedName) => {
    const error = APIError.fromResponse(status, { message: "test" }, headers);
    expect(error.name).toBe(expectedName);
    expect(error.status).toBe(status);
    expect(error.message).toBe("test");
  });

  it("extracts message from body", () => {
    const error = APIError.fromResponse(400, { message: "Invalid input" }, headers);
    expect(error.message).toBe("Invalid input");
  });

  it("falls back to generic message when body has no message", () => {
    const error = APIError.fromResponse(418, null, headers);
    expect(error.message).toBe("API error 418");
  });

  it("preserves the response body", () => {
    const body = { message: "test", details: [1, 2, 3] };
    const error = APIError.fromResponse(400, body, headers);
    expect(error.body).toBe(body);
  });

  it("creates correct error class instances", () => {
    expect(APIError.fromResponse(400, {}, headers)).toBeInstanceOf(BadRequestError);
    expect(APIError.fromResponse(401, {}, headers)).toBeInstanceOf(AuthenticationError);
    expect(APIError.fromResponse(403, {}, headers)).toBeInstanceOf(PermissionDeniedError);
    expect(APIError.fromResponse(404, {}, headers)).toBeInstanceOf(NotFoundError);
    expect(APIError.fromResponse(409, {}, headers)).toBeInstanceOf(ConflictError);
    expect(APIError.fromResponse(422, {}, headers)).toBeInstanceOf(ValidationError);
    expect(APIError.fromResponse(429, {}, headers)).toBeInstanceOf(RateLimitError);
    expect(APIError.fromResponse(500, {}, headers)).toBeInstanceOf(InternalServerError);
  });
});
