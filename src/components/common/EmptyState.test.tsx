import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders default title', () => {
    render(<EmptyState />);

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<EmptyState title="No grants available" />);

    expect(screen.getByText('No grants available')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <EmptyState
        title="No results"
        description="Try adjusting your filters"
      />
    );

    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="No results" />);

    const descriptions = container.querySelectorAll('p');
    expect(descriptions).toHaveLength(1); // Only title
  });

  it('renders action button when provided', () => {
    render(
      <EmptyState
        title="No results"
        actionLabel="Clear filters"
        onAction={vi.fn()}
      />
    );

    expect(screen.getByText('Clear filters')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <EmptyState
        title="No results"
        actionLabel="Clear filters"
        onAction={onAction}
      />
    );

    await user.click(screen.getByText('Clear filters'));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when onAction is not provided', () => {
    render(
      <EmptyState
        title="No results"
        actionLabel="Clear filters"
      />
    );

    expect(screen.queryByText('Clear filters')).not.toBeInTheDocument();
  });

  it('does not render action button when actionLabel is not provided', () => {
    render(
      <EmptyState
        title="No results"
        onAction={vi.fn()}
      />
    );

    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('applies correct styling', () => {
    const { container } = render(
      <EmptyState
        title="No results"
        description="Try again"
        actionLabel="Reset"
        onAction={vi.fn()}
      />
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('text-center', 'py-16');
  });

  it('renders all elements together', () => {
    render(
      <EmptyState
        title="No grants found"
        description="Try changing your search criteria"
        actionLabel="Clear all filters"
        onAction={vi.fn()}
      />
    );

    expect(screen.getByText('No grants found')).toBeInTheDocument();
    expect(screen.getByText('Try changing your search criteria')).toBeInTheDocument();
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });
});
