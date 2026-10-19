/**
 * API-related type definitions
 */

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code?: string;
  message?: string;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}
