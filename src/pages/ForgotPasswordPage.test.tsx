import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ForgotPasswordPage from './ForgotPasswordPage';
import * as authApi from '@/api/auth';

// Mock the auth API
vi.mock('@/api/auth', () => ({
  authApi: {
    forgotPassword: vi.fn(),
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

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    );
  };

  it('renders forgot password form', () => {
    renderComponent();
    
    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset instructions/i })).toBeInTheDocument();
  });

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    await user.click(submitButton);
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(authApi.authApi.forgotPassword).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'notanemail');
    
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    await user.click(submitButton);
    
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(authApi.authApi.forgotPassword).not.toHaveBeenCalled();
  });

  it('submits form with valid email', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.authApi.forgotPassword).mockResolvedValueOnce();
    
    renderComponent();
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'test@example.com');
    
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(authApi.authApi.forgotPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.authApi.forgotPassword).mockResolvedValueOnce();
    
    renderComponent();
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'test@example.com');
    
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    await user.click(submitButton);
    
    expect(await screen.findByRole('heading', { name: /check your email/i })).toBeInTheDocument();
    expect(await screen.findByText(/test@example.com/i)).toBeInTheDocument();
  });

  it('disables submit button while processing', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.authApi.forgotPassword).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    
    renderComponent();
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'test@example.com');
    
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/sending/i);
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('handles API error gracefully', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Service temporarily unavailable';
    vi.mocked(authApi.authApi.forgotPassword).mockRejectedValueOnce(
      new Error(errorMessage)
    );
    
    renderComponent();
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'test@example.com');
    
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    await user.click(submitButton);
    
    // Should still show success screen for security reasons
    // (don't reveal whether email exists)
    expect(await screen.findByRole('heading', { name: /check your email/i })).toBeInTheDocument();
  });

  it('has link back to login', () => {
    renderComponent();
    
    const loginLink = screen.getByRole('link', { name: /back to login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('clears validation error when user starts typing', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Trigger validation error
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    await user.click(submitButton);
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    
    // Start typing
    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 't');
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    });
  });

  it('trims whitespace from email', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.authApi.forgotPassword).mockResolvedValueOnce();
    
    renderComponent();
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, '  test@example.com  ');
    
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(authApi.authApi.forgotPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows back to login button on success screen', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.authApi.forgotPassword).mockResolvedValueOnce();
    
    renderComponent();
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'test@example.com');
    
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    await user.click(submitButton);
    
    expect(await screen.findByRole('button', { name: /back to login/i })).toBeInTheDocument();
  });
});
