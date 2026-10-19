import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ManageIdentities } from './ManageIdentities';
import { foundersApi, Identity } from '@/api/endpoints/founders';

vi.mock('@/api/endpoints/founders', () => ({
  foundersApi: {
    getIdentities: vi.fn(),
    unlinkIdentity: vi.fn(),
  },
}));

const mockIdentities: Identity[] = [
  { provider: 'EMAIL', linkedAt: '2024-01-15T10:00:00Z' },
  { provider: 'GOOGLE', linkedAt: '2024-02-20T14:30:00Z' },
];

describe('ManageIdentities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays identities', async () => {
    vi.mocked(foundersApi.getIdentities).mockResolvedValue(mockIdentities);

    render(<ManageIdentities />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/email & password/i)).toBeInTheDocument();
      expect(screen.getByText(/google/i)).toBeInTheDocument();
    });
  });

  it('displays linked dates', async () => {
    vi.mocked(foundersApi.getIdentities).mockResolvedValue(mockIdentities);

    render(<ManageIdentities />);

    await waitFor(() => {
      expect(screen.getByText(/jan 15, 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/feb 20, 2024/i)).toBeInTheDocument();
    });
  });

  it('shows unlink buttons when multiple identities exist', async () => {
    vi.mocked(foundersApi.getIdentities).mockResolvedValue(mockIdentities);

    render(<ManageIdentities />);

    await waitFor(() => {
      const unlinkButtons = screen.getAllByRole('button', { name: /unlink/i });
      expect(unlinkButtons).toHaveLength(2);
      unlinkButtons.forEach((button) => expect(button).not.toBeDisabled());
    });
  });

  it('disables unlink buttons when only one identity exists', async () => {
    vi.mocked(foundersApi.getIdentities).mockResolvedValue([mockIdentities[0]]);

    render(<ManageIdentities />);

    await waitFor(() => {
      const unlinkButton = screen.getByRole('button', { name: /unlink/i });
      expect(unlinkButton).toBeDisabled();
    });

    expect(
      screen.getByText(/you must have at least one sign-in method/i)
    ).toBeInTheDocument();
  });

  it('shows confirmation modal when unlink is clicked', async () => {
    vi.mocked(foundersApi.getIdentities).mockResolvedValue(mockIdentities);

    render(<ManageIdentities />);

    await waitFor(() => {
      expect(screen.getByText(/email & password/i)).toBeInTheDocument();
    });

    const unlinkButtons = screen.getAllByRole('button', { name: /^unlink$/i });
    fireEvent.click(unlinkButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/unlink email & password\?/i)).toBeInTheDocument();
    });
  });

  it('unlinks identity when confirmed', async () => {
    vi.mocked(foundersApi.getIdentities).mockResolvedValue(mockIdentities);
    vi.mocked(foundersApi.unlinkIdentity).mockResolvedValue(undefined);

    render(<ManageIdentities />);

    await waitFor(() => {
      expect(screen.getByText(/email & password/i)).toBeInTheDocument();
    });

    const unlinkButtons = screen.getAllByRole('button', { name: /^unlink$/i });
    fireEvent.click(unlinkButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/unlink email & password\?/i)).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: /^unlink$/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(foundersApi.unlinkIdentity).toHaveBeenCalledWith('EMAIL');
    });
  });

  it('shows error when trying to unlink last identity', async () => {
    vi.mocked(foundersApi.getIdentities).mockResolvedValue(mockIdentities);
    vi.mocked(foundersApi.unlinkIdentity).mockRejectedValue({
      response: { status: 409 },
    });

    render(<ManageIdentities />);

    await waitFor(() => {
      expect(screen.getByText(/email & password/i)).toBeInTheDocument();
    });

    const unlinkButtons = screen.getAllByRole('button', { name: /^unlink$/i });
    fireEvent.click(unlinkButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/unlink email & password\?/i)).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: /^unlink$/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText(/cannot unlink your last sign-in method/i)
      ).toBeInTheDocument();
    });
  });

  it('closes confirmation modal when cancel is clicked', async () => {
    vi.mocked(foundersApi.getIdentities).mockResolvedValue(mockIdentities);

    render(<ManageIdentities />);

    await waitFor(() => {
      expect(screen.getByText(/email & password/i)).toBeInTheDocument();
    });

    const unlinkButtons = screen.getAllByRole('button', { name: /^unlink$/i });
    fireEvent.click(unlinkButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/unlink email & password\?/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(/unlink email & password\?/i)).not.toBeInTheDocument();
    });
  });

  it('handles error when loading identities fails', async () => {
    vi.mocked(foundersApi.getIdentities).mockRejectedValue(new Error('Network error'));

    render(<ManageIdentities />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
