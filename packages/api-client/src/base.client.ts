import type { ApiResponse, ApiErrorResponse } from '@poc/types';

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

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.authToken) headers['Authorization'] = `Bearer ${this.authToken}`;
    return headers;
  }

  protected async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.buildHeaders(),
    });
    return this.handleResponse<T>(res);
  }

  protected async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(res);
  }

  protected async put<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(res);
  }

  protected async delete<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.buildHeaders(),
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
