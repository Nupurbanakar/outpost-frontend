import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserMenu } from './UserMenu';
import { AuthContext } from '@/contexts/AuthContext';

const mockLogout = vi.fn();

const mockUser = {
  id: '123',
  email: 'john@example.com',
  founderName: 'John Doe',
  startupName: 'Test Startup',
  city: 'Bangalore',
};

const renderWithAuth = (user: any = mockUser) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          user,
          logout: mockLogout,
          login: vi.fn(),
          signup: vi.fn(),
          refreshUser: vi.fn(),
          isAuthenticated: true,
          isLoading: false,
        }}
      >
        <UserMenu />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders avatar button with user initials', () => {
    renderWithAuth();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('shows menu when avatar is clicked', () => {
    renderWithAuth();
    
    const button = screen.getByLabelText('User menu');
    fireEvent.click(button);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('displays menu items', () => {
    renderWithAuth();
    
    const button = screen.getByLabelText('User menu');
    fireEvent.click(button);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('closes menu when clicking outside', async () => {
    renderWithAuth();
    
    const button = screen.getByLabelText('User menu');
    fireEvent.click(button);

    expect(screen.getByText('Profile')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });
  });

  it('closes menu when Escape is pressed', async () => {
    renderWithAuth();
    
    const button = screen.getByLabelText('User menu');
    fireEvent.click(button);

    expect(screen.getByText('Profile')).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });
  });

  it('calls logout when logout button is clicked', () => {
    renderWithAuth();
    
    const button = screen.getByLabelText('User menu');
    fireEvent.click(button);

    const logoutButton = screen.getByText('Log out');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('handles single name initials', () => {
    renderWithAuth({ ...mockUser, founderName: 'John' });
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('handles missing founder name', () => {
    renderWithAuth({ ...mockUser, founderName: '' });
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('closes menu when Profile link is clicked', async () => {
    renderWithAuth();
    
    const button = screen.getByLabelText('User menu');
    fireEvent.click(button);

    const profileLink = screen.getByText('Profile');
    fireEvent.click(profileLink);

    await waitFor(() => {
      expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
    });
  });

  it('has proper ARIA attributes', () => {
    renderWithAuth();
    
    const button = screen.getByLabelText('User menu');
    expect(button).toHaveAttribute('aria-haspopup', 'true');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});
