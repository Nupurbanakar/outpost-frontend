import { AxiosError } from 'axios';
import type { ApiError } from '@/types';

/**
 * Parse an Axios error into a user-friendly message
 */
export function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;

    // If we have a structured API error
    if (apiError) {
      // Return the detail message or message field
      return apiError.detail || apiError.message || 'An unexpected error occurred';
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.';
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }

    // Generic error based on status
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Unauthorized. Please log in again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'Conflict. The resource already exists.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return error.message || 'An unexpected error occurred';
      }
    }

    return error.message || 'An unexpected error occurred';
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Get field-specific error messages from an API error
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;

    if (apiError?.errors && Array.isArray(apiError.errors)) {
      return apiError.errors.reduce(
        (acc, fieldError) => {
          acc[fieldError.field] = fieldError.message;
          return acc;
        },
        {} as Record<string, string>
      );
    }
  }

  return {};
}

/**
 * Check if an error is a specific error code
 */
export function isErrorCode(error: unknown, code: string): boolean {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    return apiError?.code === code;
  }
  return false;
}

/**
 * Log error for debugging (only in development)
 */
export function logError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    console.error(`[API Error${context ? ` - ${context}` : ''}]:`, error);

    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiError | undefined;
      if (apiError) {
        console.error('API Error Details:', {
          status: error.response?.status,
          code: apiError.code,
          message: apiError.detail || apiError.message,
          errors: apiError.errors,
        });
      }
    }
  }
}
