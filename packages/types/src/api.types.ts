// ─────────────────────────────────────────────────────────
// SHARED API response shapes
// ─────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;       // which field caused the error (for form validation)
  details?: unknown;
}

export interface ApiErrorResponse {
  errors: ApiError[];
  statusCode: number;
  path: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
