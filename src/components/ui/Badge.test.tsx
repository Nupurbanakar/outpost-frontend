import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';

describe('Badge Component', () => {
  it('should render with children', () => {
    render(<Badge>Badge Text</Badge>);
    expect(screen.getByText('Badge Text')).toBeInTheDocument();
  });

  it('should apply default variant by default', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-paper', 'text-muted-text');
  });

  it('should apply grant variant', () => {
    render(<Badge variant="grant">Grant</Badge>);
    const badge = screen.getByText('Grant');
    expect(badge).toHaveClass('bg-[#f1e6d2]', 'text-[#80591f]');
  });

  it('should apply challenge variant', () => {
    render(<Badge variant="challenge">Challenge</Badge>);
    const badge = screen.getByText('Challenge');
    expect(badge).toHaveClass('bg-[#e2ece5]', 'text-[#376b58]');
  });

  it('should apply scheme variant', () => {
    render(<Badge variant="scheme">Scheme</Badge>);
    const badge = screen.getByText('Scheme');
    expect(badge).toHaveClass('bg-[#f0dfdc]', 'text-[#925651]');
  });

  it('should apply tag variant', () => {
    render(<Badge variant="tag">Tag</Badge>);
    const badge = screen.getByText('Tag');
    expect(badge).toHaveClass('bg-[#f2efe8]', 'text-[#6f7478]');
  });

  it('should have base styles', () => {
    render(<Badge>Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('inline-flex', 'items-center', 'px-2', 'py-1', 'text-xs', 'font-medium', 'mono-label');
  });

  it('should accept custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-badge');
  });

  it('should forward ref to span element', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement>;
    render(<Badge ref={ref}>With Ref</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('should support HTML attributes', () => {
    render(
      <Badge 
        title="Badge title" 
        data-testid="test-badge"
        aria-label="Badge label"
      >
        Test
      </Badge>
    );
    const badge = screen.getByTestId('test-badge');
    expect(badge).toHaveAttribute('title', 'Badge title');
    expect(badge).toHaveAttribute('aria-label', 'Badge label');
  });

  it('should render as a span element', () => {
    render(<Badge>Span Badge</Badge>);
    const badge = screen.getByText('Span Badge');
    expect(badge.tagName).toBe('SPAN');
  });

  it('should combine variant and custom classes', () => {
    render(
      <Badge variant="grant" className="ml-2 uppercase">
        Combined
      </Badge>
    );
    const badge = screen.getByText('Combined');
    
    // Check variant styles
    expect(badge).toHaveClass('bg-[#f1e6d2]');
    // Check custom classes
    expect(badge).toHaveClass('ml-2', 'uppercase');
  });

  it('should handle onClick events', () => {
    const handleClick = vi.fn();
    render(<Badge onClick={handleClick}>Clickable</Badge>);
    const badge = screen.getByText('Clickable');
    
    badge.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
