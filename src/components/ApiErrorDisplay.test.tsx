import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError } from 'axios';
import { ApiErrorDisplay } from './ApiErrorDisplay';
import type { ApiError } from '@/types';

// Mock the AuthContext
const mockLogout = vi.fn();
vi.mock('@/contexts', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

// Mock window.location
delete (window as any).location;
window.location = { href: '' } as any;

describe('ApiErrorDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.href = '';
  });

  it('renders error message', () => {
    const error = new AxiosError('Bad Request');
    error.response = {
      data: {
        code: 'VALIDATION_ERROR',
        detail: 'Email is required',
      } as ApiError,
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as any,
    };

    render(<ApiErrorDisplay error={error} />);

    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const error = new AxiosError('Error');
    error.response = {
      data: { detail: 'Test error' } as ApiError,
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as any,
    };

    const { container } = render(<ApiErrorDisplay error={error} className="custom-class" />);
    const errorDiv = container.firstChild as HTMLElement;

    expect(errorDiv).toHaveClass('custom-class');
  });

  it('shows logout button for AUTH_SESSION_ERROR code', async () => {
    const user = userEvent.setup();
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

    render(<ApiErrorDisplay error={error} />);

    const logoutButton = screen.getByRole('button', { name: /log out and try again/i });
    expect(logoutButton).toBeInTheDocument();

    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe('/login');
  });

  it('shows logout button for authentication issue messages', async () => {
    const user = userEvent.setup();
    const error = new AxiosError('Error');
    error.response = {
      data: {
        detail: 'There is a temporary authentication issue. Please log out and log back in.',
      } as ApiError,
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: {} as any,
    };

    render(<ApiErrorDisplay error={error} />);

    const logoutButton = screen.getByRole('button', { name: /log out and try again/i });
    expect(logoutButton).toBeInTheDocument();

    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe('/login');
  });

  it('shows logout button for UUID parsing errors', () => {
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

    render(<ApiErrorDisplay error={error} />);

    const logoutButton = screen.getByRole('button', { name: /log out and try again/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('does not show logout button for non-auth errors', () => {
    const error = new AxiosError('Bad Request');
    error.response = {
      data: {
        code: 'VALIDATION_ERROR',
        detail: 'Invalid input',
      } as ApiError,
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as any,
    };

    render(<ApiErrorDisplay error={error} />);

    expect(screen.queryByRole('button', { name: /log out and try again/i })).not.toBeInTheDocument();
  });

  it('displays AlertCircle icon', () => {
    const error = new AxiosError('Error');
    error.response = {
      data: { detail: 'Test error' } as ApiError,
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as any,
    };

    const { container } = render(<ApiErrorDisplay error={error} />);

    // Check for svg element (AlertCircle icon)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('handles network errors', () => {
    const error = new AxiosError('Network Error');
    error.code = 'ERR_NETWORK';

    render(<ApiErrorDisplay error={error} />);

    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  it('handles timeout errors', () => {
    const error = new AxiosError('Timeout');
    error.code = 'ECONNABORTED';

    render(<ApiErrorDisplay error={error} />);

    expect(screen.getByText(/request timed out/i)).toBeInTheDocument();
  });

  it('handles generic errors', () => {
    const error = new Error('Something went wrong');

    render(<ApiErrorDisplay error={error} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const error = new AxiosError('Error');
    error.response = {
      data: { detail: 'Test error' } as ApiError,
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as any,
    };

    const { container } = render(<ApiErrorDisplay error={error} />);
    const errorDiv = container.firstChild as HTMLElement;

    expect(errorDiv).toHaveClass('flex', 'items-start', 'gap-3', 'p-4');
    expect(errorDiv).toHaveClass('bg-rose-50', 'border', 'border-rose-200', 'text-rose-800');
  });

  it('logout button has correct styling', () => {
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

    render(<ApiErrorDisplay error={error} />);

    const logoutButton = screen.getByRole('button', { name: /log out and try again/i });
    expect(logoutButton).toHaveClass('border-rose-300', 'text-rose-700', 'hover:bg-rose-100');
  });
});
