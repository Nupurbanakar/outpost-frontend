import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GrantKeyInfo } from './GrantKeyInfo';
import { Grant } from '@/api/endpoints/grants';

const mockGrant: Grant = {
  id: '123',
  title: 'Test Grant',
  summary: 'Test summary',
  type: 'GRANT',
  issuingBody: 'Ministry of Science',
  issuingBodyType: 'CENTRAL',
  amountMin: 100000,
  amountMax: 500000,
  deadline: '2024-12-31',
  status: 'PUBLISHED',
  sourceUrl: 'https://example.com',
  eligibleStages: [
    { id: '1', name: 'Ideation' },
    { id: '2', name: 'Validation' },
  ],
  eligibleSectors: [
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Healthcare' },
  ],
};

describe('GrantKeyInfo', () => {
  it('renders amount range correctly', () => {
    render(<GrantKeyInfo grant={mockGrant} />);

    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText(/₹1L - ₹5L/)).toBeInTheDocument();
  });

  it('renders deadline', () => {
    render(<GrantKeyInfo grant={mockGrant} />);

    expect(screen.getByText('Deadline')).toBeInTheDocument();
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument();
  });

  it('renders rolling deadline when no deadline provided', () => {
    const grantWithoutDeadline = { ...mockGrant, deadline: null };
    render(<GrantKeyInfo grant={grantWithoutDeadline} />);

    expect(screen.getByText('Rolling')).toBeInTheDocument();
  });

  it('renders eligible stages', () => {
    render(<GrantKeyInfo grant={mockGrant} />);

    expect(screen.getByText('Stages')).toBeInTheDocument();
    expect(screen.getByText('Ideation')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
  });

  it('renders eligible sectors', () => {
    render(<GrantKeyInfo grant={mockGrant} />);

    expect(screen.getByText('Sectors')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
  });

  it('handles grant with only minimum amount', () => {
    const grantWithMinOnly = { ...mockGrant, amountMax: null };
    render(<GrantKeyInfo grant={grantWithMinOnly} />);

    expect(screen.getByText(/Up to ₹1L/)).toBeInTheDocument();
  });

  it('handles grant with undisclosed amount', () => {
    const grantWithNoAmount = { ...mockGrant, amountMin: null, amountMax: null };
    render(<GrantKeyInfo grant={grantWithNoAmount} />);

    expect(screen.getByText('Undisclosed')).toBeInTheDocument();
  });

  it('does not render stages section when no stages provided', () => {
    const grantWithoutStages = { ...mockGrant, eligibleStages: null };
    render(<GrantKeyInfo grant={grantWithoutStages} />);

    expect(screen.queryByText('Stages')).not.toBeInTheDocument();
  });

  it('does not render sectors section when no sectors provided', () => {
    const grantWithoutSectors = { ...mockGrant, eligibleSectors: null };
    render(<GrantKeyInfo grant={grantWithoutSectors} />);

    expect(screen.queryByText('Sectors')).not.toBeInTheDocument();
  });

  it('renders in grid layout', () => {
    const { container } = render(<GrantKeyInfo grant={mockGrant} />);

    const grid = container.firstChild;
    expect(grid).toHaveClass('grid', 'gap-4');
  });
});
