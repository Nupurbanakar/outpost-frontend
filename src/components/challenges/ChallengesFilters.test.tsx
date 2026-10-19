import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChallengesFiltersPanel } from './ChallengesFilters';
import { challengesApi } from '@/api/endpoints/challenges';

vi.mock('@/hooks/useSectors', () => ({
  useSectors: () => ({
    sectors: [
      { id: '1', name: 'Technology' },
      { id: '2', name: 'Healthcare' },
    ],
    isLoading: false,
  }),
}));

vi.mock('@/api/endpoints/challenges', () => ({
  challengesApi: {
    getThemes: vi.fn(),
  },
}));

describe('ChallengesFiltersPanel', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnClearFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(challengesApi.getThemes).mockResolvedValue(['AI/ML', 'Sustainability', 'Fintech']);
  });

  it('renders AI toggle', async () => {
    render(
      <ChallengesFiltersPanel
        aiEnabled={false}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        activeFiltersCount={0}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/ai-ranked results/i)).toBeInTheDocument();
    });
  });

  it('toggles AI filter', async () => {
    render(
      <ChallengesFiltersPanel
        aiEnabled={false}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        activeFiltersCount={0}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith('ai', true);
  });

  it('renders status filters', async () => {
    render(
      <ChallengesFiltersPanel
        aiEnabled={false}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        activeFiltersCount={0}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBeGreaterThanOrEqual(3);
  });

  it('changes status filter', async () => {
    render(
      <ChallengesFiltersPanel
        selectedStatus={undefined}
        aiEnabled={false}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        activeFiltersCount={0}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    const openRadio = screen.getByRole('radio', { name: /open/i });
    fireEvent.click(openRadio);

    expect(mockOnFilterChange).toHaveBeenCalledWith('status', 'OPEN');
  });

  it('loads and displays themes', async () => {
    render(
      <ChallengesFiltersPanel
        aiEnabled={false}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        activeFiltersCount={0}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('AI/ML')).toBeInTheDocument();
      expect(screen.getByText('Sustainability')).toBeInTheDocument();
      expect(screen.getByText('Fintech')).toBeInTheDocument();
    });
  });

  it('shows clear filters button when filters are active', () => {
    render(
      <ChallengesFiltersPanel
        aiEnabled={false}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        activeFiltersCount={2}
      />
    );

    expect(screen.getByText(/2 filters applied/i)).toBeInTheDocument();
    expect(screen.getByText(/clear all/i)).toBeInTheDocument();
  });

  it('calls onClearFilters when clear button is clicked', () => {
    render(
      <ChallengesFiltersPanel
        aiEnabled={false}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        activeFiltersCount={1}
      />
    );

    const clearButton = screen.getByText(/clear all/i);
    fireEvent.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalled();
  });

  it('handles corporate name input', async () => {
    render(
      <ChallengesFiltersPanel
        aiEnabled={false}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        activeFiltersCount={0}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Corporate')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/filter by corporate name/i);
    fireEvent.change(input, { target: { value: 'Google' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith('corporate', 'Google');
  });
});
