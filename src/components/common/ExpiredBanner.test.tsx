import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExpiredBanner } from './ExpiredBanner';

describe('ExpiredBanner', () => {
  it('renders expired message', () => {
    render(<ExpiredBanner />);

    expect(screen.getByText('This grant has expired')).toBeInTheDocument();
    expect(
      screen.getByText(/The deadline for this grant has passed/)
    ).toBeInTheDocument();
  });

  it('applies correct styling for warning banner', () => {
    const { container } = render(<ExpiredBanner />);

    const banner = container.firstChild;
    expect(banner).toHaveClass('bg-rose-50', 'border-rose-500', 'text-rose-800');
  });

  it('has appropriate visual hierarchy', () => {
    render(<ExpiredBanner />);

    const heading = screen.getByText('This grant has expired');
    expect(heading.tagName).toBe('P');
    expect(heading).toHaveClass('font-semibold');
  });
});
