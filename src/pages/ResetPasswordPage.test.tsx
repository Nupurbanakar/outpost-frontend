import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import ResetPasswordPage from './ResetPasswordPage';
import * as authApi from '@/api/auth';

// Mock the auth API
vi.mock('@/api/auth', () => ({
  authApi: {
    resetPassword: vi.fn(),
  },
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithToken = (token: string = 'valid-token-123') => {
    return render(
      <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
        <ResetPasswordPage />
      </MemoryRouter>
    );
  };

  const renderWithoutToken = () => {
    return render(
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    );
  };

  describe('without token', () => {
    it('shows invalid token screen when no token provided', () => {
      renderWithoutToken();
      
      expect(screen.getByRole('heading', { name: /invalid or expired link/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /request new reset link/i })).toBeInTheDocument();
    });

    it('shows invalid token screen for empty token', () => {
      render(
        <MemoryRouter initialEntries={['/reset-password?token=']}>
          <ResetPasswordPage />
        </MemoryRouter>
      );
      
      expect(screen.getByRole('heading', { name: /invalid or expired link/i })).toBeInTheDocument();
    });

    it('has link to request new reset link', () => {
      renderWithoutToken();
      
      const requestLink = screen.getByRole('button', { name: /request new reset link/i });
      expect(requestLink).toBeInTheDocument();
    });

    it('has back to login link on invalid token screen', () => {
      renderWithoutToken();
      
      const loginLink = screen.getByRole('button', { name: /back to login/i });
      expect(loginLink).toBeInTheDocument();
    });
  });

  describe('with valid token', () => {
    it('renders reset password form', () => {
      renderWithToken();
      
      expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/confirm/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
    });

    it('shows password requirements', () => {
      renderWithToken();
      
      expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
    });

    it('shows validation error for empty password', async () => {
      const user = userEvent.setup();
      renderWithToken();
      
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(submitButton);
      
      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
      expect(authApi.authApi.resetPassword).not.toHaveBeenCalled();
    });

    it('shows validation error for short password', async () => {
      const user = userEvent.setup();
      renderWithToken();
      
      const passwordInput = screen.getByPlaceholderText(/new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm/i);
      
      await user.type(passwordInput, 'short123');
      await user.type(confirmInput, 'short123');
      
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(submitButton);
      
      expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument();
      expect(authApi.authApi.resetPassword).not.toHaveBeenCalled();
    });

    it('shows validation error for password mismatch', async () => {
      const user = userEvent.setup();
      renderWithToken();
      
      const passwordInput = screen.getByPlaceholderText(/new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm/i);
      
      await user.type(passwordInput, 'password1234');
      await user.type(confirmInput, 'different1234');
      
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(submitButton);
      
      expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
      expect(authApi.authApi.resetPassword).not.toHaveBeenCalled();
    });

    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      const token = 'valid-token-123';
      vi.mocked(authApi.authApi.resetPassword).mockResolvedValueOnce();
      
      renderWithToken(token);
      
      const passwordInput = screen.getByPlaceholderText(/new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm/i);
      
      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmInput, 'newpassword123');
      
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(authApi.authApi.resetPassword).toHaveBeenCalledWith(token, 'newpassword123');
      });
    });

    it('redirects to login after successful reset', async () => {
      const user = userEvent.setup();
      vi.mocked(authApi.authApi.resetPassword).mockResolvedValueOnce();
      
      renderWithToken();
      
      const passwordInput = screen.getByPlaceholderText(/new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm/i);
      
      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmInput, 'newpassword123');
      
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('disables submit button while processing', async () => {
      const user = userEvent.setup();
      vi.mocked(authApi.authApi.resetPassword).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );
      
      renderWithToken();
      
      const passwordInput = screen.getByPlaceholderText(/new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm/i);
      
      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmInput, 'newpassword123');
      
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(submitButton);
      
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/resetting/i);
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('shows error for expired token', async () => {
      const user = userEvent.setup();
      vi.mocked(authApi.authApi.resetPassword).mockRejectedValueOnce({
        response: {
          data: {
            code: 'TOKEN_INVALID',
            message: 'Token is invalid or expired',
          },
        },
      });
      
      renderWithToken();
      
      const passwordInput = screen.getByPlaceholderText(/new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm/i);
      
      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmInput, 'newpassword123');
      
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(submitButton);
      
      expect(await screen.findByText(/token is invalid or expired/i)).toBeInTheDocument();
    });

    it('clears password field errors when user types', async () => {
      const user = userEvent.setup();
      renderWithToken();
      
      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(submitButton);
      
      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
      
      // Start typing
      const passwordInput = screen.getByPlaceholderText(/new password/i);
      await user.type(passwordInput, 'p');
      
      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
      });
    });

    it('clears confirm password error when user types', async () => {
      const user = userEvent.setup();
      renderWithToken();
      
      const passwordInput = screen.getByPlaceholderText(/new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm/i);
      
      // Create mismatch
      await user.type(passwordInput, 'password1234');
      await user.type(confirmInput, 'different1234');
      
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(submitButton);
      
      expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
      
      // Fix mismatch
      await user.clear(confirmInput);
      await user.type(confirmInput, 'p');
      
      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
      });
    });

    it('has link back to login', () => {
      renderWithToken();
      
      const loginLink = screen.getByRole('link', { name: /back to login/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('accepts passwords with special characters', async () => {
      const user = userEvent.setup();
      vi.mocked(authApi.authApi.resetPassword).mockResolvedValueOnce();
      
      renderWithToken();
      
      const passwordInput = screen.getByPlaceholderText(/new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm/i);
      const specialPassword = 'P@ssw0rd!123';
      
      await user.type(passwordInput, specialPassword);
      await user.type(confirmInput, specialPassword);
      
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(authApi.authApi.resetPassword).toHaveBeenCalledWith(
          'valid-token-123',
          specialPassword
        );
      });
    });

    it('handles network errors gracefully', async () => {
      const user = userEvent.setup();
      vi.mocked(authApi.authApi.resetPassword).mockRejectedValueOnce({
        code: 'ERR_NETWORK',
        message: 'Network Error',
      });
      
      renderWithToken();
      
      const passwordInput = screen.getByPlaceholderText(/new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm/i);
      
      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmInput, 'newpassword123');
      
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(submitButton);
      
      // Should show error message
      expect(await screen.findByText(/network/i)).toBeInTheDocument();
    });
  });
});
