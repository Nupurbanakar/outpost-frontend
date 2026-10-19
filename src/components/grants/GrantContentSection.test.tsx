import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GrantContentSection } from './GrantContentSection';

describe('GrantContentSection', () => {
  it('renders title and content', () => {
    render(
      <GrantContentSection
        title="Eligibility"
        content="Must be a registered startup"
      />
    );

    expect(screen.getByText('Eligibility')).toBeInTheDocument();
    expect(screen.getByText('Must be a registered startup')).toBeInTheDocument();
  });

  it('preserves whitespace in content', () => {
    const multiLineContent = 'Line 1\nLine 2\nLine 3';
    render(<GrantContentSection title="Test" content={multiLineContent} />);

    const contentDiv = screen.getByText(/Line 1/).parentElement;
    expect(contentDiv).toHaveClass('whitespace-pre-line');
  });

  it('renders with long content', () => {
    const longContent = 'A'.repeat(1000);
    render(<GrantContentSection title="Summary" content={longContent} />);

    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  it('applies correct heading styling', () => {
    render(<GrantContentSection title="Test Title" content="Test content" />);

    const heading = screen.getByText('Test Title');
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveClass('font-serif', 'font-bold', 'text-ink');
  });
});
