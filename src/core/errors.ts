export class ProwexError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProwexError";
  }
}

export class APIError extends ProwexError {
  readonly status: number;
  readonly body: unknown;
  readonly headers: Headers;

  constructor(status: number, body: unknown, headers: Headers) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as Record<string, unknown>).message)
        : `API error ${status}`;
    super(message);
    this.name = "APIError";
    this.status = status;
    this.body = body;
    this.headers = headers;
  }

  static fromResponse(status: number, body: unknown, headers: Headers): APIError {
    switch (status) {
      case 400:
        return new BadRequestError(body, headers);
      case 401:
        return new AuthenticationError(body, headers);
      case 403:
        return new PermissionDeniedError(body, headers);
      case 404:
        return new NotFoundError(body, headers);
      case 409:
        return new ConflictError(body, headers);
      case 422:
        return new ValidationError(body, headers);
      case 429:
        return new RateLimitError(body, headers);
      default:
        if (status >= 500) return new InternalServerError(status, body, headers);
        return new APIError(status, body, headers);
    }
  }
}

export class BadRequestError extends APIError {
  constructor(body: unknown, headers: Headers) {
    super(400, body, headers);
    this.name = "BadRequestError";
  }
}

export class AuthenticationError extends APIError {
  constructor(body: unknown, headers: Headers) {
    super(401, body, headers);
    this.name = "AuthenticationError";
  }
}

export class PermissionDeniedError extends APIError {
  constructor(body: unknown, headers: Headers) {
    super(403, body, headers);
    this.name = "PermissionDeniedError";
  }
}

export class NotFoundError extends APIError {
  constructor(body: unknown, headers: Headers) {
    super(404, body, headers);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends APIError {
  constructor(body: unknown, headers: Headers) {
    super(409, body, headers);
    this.name = "ConflictError";
  }
}

export class ValidationError extends APIError {
  constructor(body: unknown, headers: Headers) {
    super(422, body, headers);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends APIError {
  constructor(body: unknown, headers: Headers) {
    super(429, body, headers);
    this.name = "RateLimitError";
  }
}

export class InternalServerError extends APIError {
  constructor(status: number, body: unknown, headers: Headers) {
    super(status, body, headers);
    this.name = "InternalServerError";
  }
}

export class ConnectionError extends ProwexError {
  constructor(message: string) {
    super(message);
    this.name = "ConnectionError";
  }
}

export class TimeoutError extends ProwexError {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}
