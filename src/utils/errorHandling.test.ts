import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosError } from 'axios';
import { parseApiError, getFieldErrors, isErrorCode, logError } from '@/utils/errorHandling';
import type { ApiError } from '@/types';

describe('errorHandling utilities', () => {
  describe('parseApiError', () => {
    it('should parse structured API error with detail', () => {
      const apiError: ApiError = {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        detail: 'Email is required',
      };

      const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: apiError,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      });

      expect(parseApiError(axiosError)).toBe('Email is required');
    });

    it('should parse structured API error with message fallback', () => {
      const apiError: ApiError = {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
      };

      const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: apiError,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      });

      expect(parseApiError(axiosError)).toBe('Validation failed');
    });

    it('should handle network errors', () => {
      const axiosError = new AxiosError('Network Error', 'ERR_NETWORK');
      expect(parseApiError(axiosError)).toBe('Network error. Please check your connection.');
    });

    it('should handle timeout errors', () => {
      const axiosError = new AxiosError('Timeout', 'ECONNABORTED');
      expect(parseApiError(axiosError)).toBe('Request timed out. Please try again.');
    });

    it('should handle 401 unauthorized', () => {
      const axiosError = new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: {},
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      });

      expect(parseApiError(axiosError)).toBe('Unauthorized. Please log in again.');
    });

    it('should handle 403 forbidden', () => {
      const axiosError = new AxiosError('Forbidden', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: {},
        status: 403,
        statusText: 'Forbidden',
        headers: {},
        config: {} as any,
      });

      expect(parseApiError(axiosError)).toBe('You do not have permission to perform this action.');
    });

    it('should handle 404 not found', () => {
      const axiosError = new AxiosError('Not Found', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: {},
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      });

      expect(parseApiError(axiosError)).toBe('The requested resource was not found.');
    });

    it('should handle 500 server error', () => {
      const axiosError = new AxiosError('Server Error', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: {},
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      });

      expect(parseApiError(axiosError)).toBe('Server error. Please try again later.');
    });

    it('should handle generic Error objects', () => {
      const error = new Error('Something went wrong');
      expect(parseApiError(error)).toBe('Something went wrong');
    });

    it('should handle unknown errors', () => {
      expect(parseApiError('random string')).toBe('An unexpected error occurred');
      expect(parseApiError(null)).toBe('An unexpected error occurred');
      expect(parseApiError(undefined)).toBe('An unexpected error occurred');
    });
  });

  describe('getFieldErrors', () => {
    it('should extract field errors from API error', () => {
      const apiError: ApiError = {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: [
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password must be at least 10 characters' },
        ],
      };

      const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: apiError,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      });

      const fieldErrors = getFieldErrors(axiosError);
      expect(fieldErrors).toEqual({
        email: 'Email is required',
        password: 'Password must be at least 10 characters',
      });
    });

    it('should return empty object when no field errors', () => {
      const apiError: ApiError = {
        code: 'GENERIC_ERROR',
        message: 'Something went wrong',
      };

      const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: apiError,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      });

      expect(getFieldErrors(axiosError)).toEqual({});
    });

    it('should return empty object for non-Axios errors', () => {
      const error = new Error('Generic error');
      expect(getFieldErrors(error)).toEqual({});
    });
  });

  describe('isErrorCode', () => {
    it('should return true when error code matches', () => {
      const apiError: ApiError = {
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email already exists',
      };

      const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: apiError,
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: {} as any,
      });

      expect(isErrorCode(axiosError, 'EMAIL_ALREADY_EXISTS')).toBe(true);
    });

    it('should return false when error code does not match', () => {
      const apiError: ApiError = {
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email already exists',
      };

      const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: apiError,
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: {} as any,
      });

      expect(isErrorCode(axiosError, 'DIFFERENT_CODE')).toBe(false);
    });

    it('should return false for non-Axios errors', () => {
      const error = new Error('Generic error');
      expect(isErrorCode(error, 'ANY_CODE')).toBe(false);
    });
  });

  describe('logError', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should log error in development mode', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const apiError: ApiError = {
        code: 'TEST_ERROR',
        message: 'Test error message',
        detail: 'Test error detail',
      };

      const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: apiError,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      });

      logError(axiosError, 'test context');

      // In DEV mode (vitest), console.error should be called
      if (import.meta.env.DEV) {
        expect(consoleErrorSpy).toHaveBeenCalled();
      }

      consoleErrorSpy.mockRestore();
    });

    it('should log error without context', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new Error('Test error');
      logError(error);

      if (import.meta.env.DEV) {
        expect(consoleErrorSpy).toHaveBeenCalled();
      }

      consoleErrorSpy.mockRestore();
    });
  });
});
