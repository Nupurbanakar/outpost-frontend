import { describe, it, expect } from 'vitest';
import { AxiosError } from 'axios';
import { parseApiError, getFieldErrors, isErrorCode } from './errorHandling';
import type { ApiError } from '@/types';

describe('errorHandling utilities', () => {
  describe('parseApiError', () => {
    it('parses structured API error with detail', () => {
      const error = new AxiosError('Bad Request');
      error.response = {
        data: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          detail: 'Email is required',
        } as ApiError,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      expect(parseApiError(error)).toBe('Email is required');
    });

    it('parses structured API error with message fallback', () => {
      const error = new AxiosError('Bad Request');
      error.response = {
        data: {
          code: 'ERROR',
          message: 'Something went wrong',
        } as ApiError,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      expect(parseApiError(error)).toBe('Something went wrong');
    });

    it('detects UUID parsing errors', () => {
      const error = new AxiosError('Internal Server Error');
      error.response = {
        data: {
          message: 'Invalid UUID string: test@example.com',
        } as any,
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      };

      const result = parseApiError(error);
      expect(result).toContain('authentication issue');
      expect(result).toContain('log out and log back in');
    });

    it('detects IllegalArgumentException errors', () => {
      const error = new AxiosError('Internal Server Error');
      error.message = 'java.lang.IllegalArgumentException: Invalid UUID string';
      error.response = {
        data: {},
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      };

      const result = parseApiError(error);
      expect(result).toContain('authentication issue');
    });

    it('handles AUTH_SESSION_ERROR code', () => {
      const error = new AxiosError('Unauthorized');
      error.response = {
        data: {
          code: 'AUTH_SESSION_ERROR',
          detail: 'Session expired',
        } as ApiError,
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      };

      expect(parseApiError(error)).toBe('Session expired');
    });

    it('handles network errors', () => {
      const error = new AxiosError('Network Error');
      error.code = 'ERR_NETWORK';

      expect(parseApiError(error)).toBe('Network error. Please check your connection.');
    });

    it('handles timeout errors', () => {
      const error = new AxiosError('Timeout');
      error.code = 'ECONNABORTED';

      expect(parseApiError(error)).toBe('Request timed out. Please try again.');
    });

    it('handles 400 Bad Request', () => {
      const error = new AxiosError('Bad Request');
      error.response = {
        data: {},
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      expect(parseApiError(error)).toBe('Invalid request. Please check your input.');
    });

    it('handles 401 Unauthorized', () => {
      const error = new AxiosError('Unauthorized');
      error.response = {
        data: {},
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      };

      expect(parseApiError(error)).toBe('Unauthorized. Please log in again.');
    });

    it('handles 403 Forbidden', () => {
      const error = new AxiosError('Forbidden');
      error.response = {
        data: {},
        status: 403,
        statusText: 'Forbidden',
        headers: {},
        config: {} as any,
      };

      expect(parseApiError(error)).toBe('You do not have permission to perform this action.');
    });

    it('handles 404 Not Found', () => {
      const error = new AxiosError('Not Found');
      error.response = {
        data: {},
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      };

      expect(parseApiError(error)).toBe('The requested resource was not found.');
    });

    it('handles 409 Conflict', () => {
      const error = new AxiosError('Conflict');
      error.response = {
        data: {},
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: {} as any,
      };

      expect(parseApiError(error)).toBe('Conflict. The resource already exists.');
    });

    it('handles 429 Too Many Requests', () => {
      const error = new AxiosError('Too Many Requests');
      error.response = {
        data: {},
        status: 429,
        statusText: 'Too Many Requests',
        headers: {},
        config: {} as any,
      };

      expect(parseApiError(error)).toBe('Too many requests. Please try again later.');
    });

    it('handles 500 Internal Server Error', () => {
      const error = new AxiosError('Internal Server Error');
      error.response = {
        data: {},
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      };

      expect(parseApiError(error)).toBe('Server error. Please try again later.');
    });

    it('handles non-Axios errors', () => {
      const error = new Error('Something went wrong');
      expect(parseApiError(error)).toBe('Something went wrong');
    });

    it('handles unknown errors', () => {
      expect(parseApiError('unknown')).toBe('An unexpected error occurred');
    });

    it('returns generic message for Axios error without response', () => {
      const error = new AxiosError('Unknown error');
      expect(parseApiError(error)).toBe('Unknown error');
    });
  });

  describe('getFieldErrors', () => {
    it('extracts field errors from API error', () => {
      const error = new AxiosError('Bad Request');
      error.response = {
        data: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          errors: [
            { field: 'email', message: 'Email is required' },
            { field: 'password', message: 'Password is too short' },
          ],
        } as ApiError,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      const fieldErrors = getFieldErrors(error);
      expect(fieldErrors).toEqual({
        email: 'Email is required',
        password: 'Password is too short',
      });
    });

    it('returns empty object when no field errors', () => {
      const error = new AxiosError('Bad Request');
      error.response = {
        data: {
          code: 'ERROR',
          message: 'Something went wrong',
        } as ApiError,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      expect(getFieldErrors(error)).toEqual({});
    });

    it('returns empty object for non-Axios errors', () => {
      const error = new Error('Something went wrong');
      expect(getFieldErrors(error)).toEqual({});
    });

    it('returns empty object for errors without response', () => {
      const error = new AxiosError('Network Error');
      expect(getFieldErrors(error)).toEqual({});
    });

    it('handles malformed errors array', () => {
      const error = new AxiosError('Bad Request');
      error.response = {
        data: {
          code: 'ERROR',
          message: 'Error',
          errors: null,
        } as any,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      expect(getFieldErrors(error)).toEqual({});
    });
  });

  describe('isErrorCode', () => {
    it('returns true for matching error code', () => {
      const error = new AxiosError('Conflict');
      error.response = {
        data: {
          code: 'ALREADY_ONBOARDED',
          message: 'User already onboarded',
        } as ApiError,
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: {} as any,
      };

      expect(isErrorCode(error, 'ALREADY_ONBOARDED')).toBe(true);
    });

    it('returns false for non-matching error code', () => {
      const error = new AxiosError('Conflict');
      error.response = {
        data: {
          code: 'ALREADY_ONBOARDED',
          message: 'User already onboarded',
        } as ApiError,
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: {} as any,
      };

      expect(isErrorCode(error, 'VALIDATION_ERROR')).toBe(false);
    });

    it('returns false when no error code present', () => {
      const error = new AxiosError('Error');
      error.response = {
        data: {
          message: 'Error occurred',
        } as ApiError,
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      };

      expect(isErrorCode(error, 'SOME_CODE')).toBe(false);
    });

    it('returns false for non-Axios errors', () => {
      const error = new Error('Something went wrong');
      expect(isErrorCode(error, 'SOME_CODE')).toBe(false);
    });

    it('returns false for errors without response', () => {
      const error = new AxiosError('Network Error');
      expect(isErrorCode(error, 'SOME_CODE')).toBe(false);
    });

    it('is case-sensitive', () => {
      const error = new AxiosError('Error');
      error.response = {
        data: {
          code: 'ERROR_CODE',
          message: 'Error',
        } as ApiError,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      expect(isErrorCode(error, 'error_code')).toBe(false);
      expect(isErrorCode(error, 'ERROR_CODE')).toBe(true);
    });
  });
});
