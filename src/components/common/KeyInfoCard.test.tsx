import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KeyInfoCard } from './KeyInfoCard';
import { Calendar } from 'lucide-react';

describe('KeyInfoCard', () => {
  it('renders label and children', () => {
    render(
      <KeyInfoCard icon={Calendar} label="Deadline">
        <span>January 31, 2024</span>
      </KeyInfoCard>
    );

    expect(screen.getByText('Deadline')).toBeInTheDocument();
    expect(screen.getByText('January 31, 2024')).toBeInTheDocument();
  });

  it('renders with complex children', () => {
    render(
      <KeyInfoCard icon={Calendar} label="Test">
        <div>
          <span>Line 1</span>
          <span>Line 2</span>
        </div>
      </KeyInfoCard>
    );

    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(
      <KeyInfoCard icon={Calendar} label="Test">
        Content
      </KeyInfoCard>
    );

    const card = container.querySelector('.bg-paper-light');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('border', 'border-line', 'p-4');
  });
});
