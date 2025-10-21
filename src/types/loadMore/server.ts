// Generic interface for pagination parameters
export interface PaginationParams {
  offset?: number;
  limit?: number;
}

// Standardized pagination metadata
export interface PaginationMeta {
  hasMore: boolean;
  total: number;
}

// Standardized response format for all paginated data
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
