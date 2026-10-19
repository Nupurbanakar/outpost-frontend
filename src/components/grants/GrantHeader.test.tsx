import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GrantHeader } from './GrantHeader';

describe('GrantHeader', () => {
  it('renders grant title', () => {
    render(
      <GrantHeader
        title="Innovation Grant 2024"
        type="GRANT"
        issuingBody="Ministry of Science"
      />
    );

    expect(screen.getByText('Innovation Grant 2024')).toBeInTheDocument();
  });

  it('renders grant type badge', () => {
    render(
      <GrantHeader
        title="Test Grant"
        type="GRANT"
        issuingBody="Test Body"
      />
    );

    expect(screen.getByText('GRANT')).toBeInTheDocument();
  });

  it('renders issuing body with icon', () => {
    render(
      <GrantHeader
        title="Test Grant"
        type="SUBSIDY"
        issuingBody="National Innovation Foundation"
      />
    );

    expect(screen.getByText('National Innovation Foundation')).toBeInTheDocument();
  });

  it('applies correct styling to type badge', () => {
    const { container } = render(
      <GrantHeader
        title="Test Grant"
        type="GRANT"
        issuingBody="Test Body"
      />
    );

    const badge = screen.getByText('GRANT');
    expect(badge).toHaveClass('uppercase', 'tracking-wide');
  });
});
