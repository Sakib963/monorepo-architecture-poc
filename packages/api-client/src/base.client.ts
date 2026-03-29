import type { ActionResult, ApiErrorResponse, ApiResponse } from '@poc/types';

export interface RequestOptions {
  traceId?: string;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: ApiErrorResponse,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Thin base client that wraps fetch.
 * Works in any browser-side framework (Angular, React, Vue).
 * Attach an auth token by calling `setToken()` once at login.
 */
export class BaseApiClient {
  private authToken: string | null = null;

  constructor(private readonly baseUrl: string) {}

  setToken(token: string): void {
    this.authToken = token;
  }

  clearToken(): void {
    this.authToken = null;
  }

  private buildHeaders(options?: RequestOptions): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.authToken) headers['Authorization'] = `Bearer ${this.authToken}`;
    if (options?.traceId) headers['x-trace-id'] = options.traceId;
    return headers;
  }

  protected buildPaginationQuery(page = 1, limit = 20): string {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return params.toString();
  }

  protected async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.buildHeaders(options),
    });
    return this.handleResponse<T>(res);
  }

  protected async post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.buildHeaders(options),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(res);
  }

  protected async put<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.buildHeaders(options),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(res);
  }

  protected async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.buildHeaders(options),
    });
    return this.handleResponse<T>(res);
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      let body: ApiErrorResponse;
      try {
        body = (await res.json()) as ApiErrorResponse;
      } catch {
        body = { errors: [{ code: 'UNKNOWN', message: res.statusText }], statusCode: res.status, path: '', timestamp: new Date().toISOString() };
      }
      throw new ApiClientError(`HTTP ${res.status}: ${res.statusText}`, res.status, body);
    }
    const envelope = (await res.json()) as ApiResponse<T>;
    return envelope.data;
  }
}

export function mapApiErrorToActionResult(error: unknown, fallbackTraceId = 'N/A'): ActionResult<never> {
  if (error instanceof ApiClientError) {
    const first = error.body.errors?.[0];
    const traceId = (first?.details as { traceId?: string } | undefined)?.traceId ?? fallbackTraceId;
    return {
      ok: false,
      code: first?.code ?? `HTTP_${error.status}`,
      message: first?.message ?? error.message,
      traceId,
    };
  }

  if (error instanceof Error) {
    return {
      ok: false,
      code: 'UNEXPECTED_ERROR',
      message: error.message,
      traceId: fallbackTraceId,
    };
  }

  return {
    ok: false,
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    traceId: fallbackTraceId,
  };
}
