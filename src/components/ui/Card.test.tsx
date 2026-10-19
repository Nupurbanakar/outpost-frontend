import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/Card';

describe('Card Component', () => {
  it('should render with children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('should apply base styles', () => {
    render(<Card>Test Card</Card>);
    const card = screen.getByText('Test Card');
    expect(card).toHaveClass('bg-[#fffdf8]', 'border', 'border-[#ded8cc]', 'p-5');
  });

  it('should not have hover styles by default', () => {
    render(<Card>No Hover</Card>);
    const card = screen.getByText('No Hover');
    expect(card).not.toHaveClass('hover:-translate-y-1');
  });

  it('should apply hover styles when hover is true', () => {
    render(<Card hover>Hover Card</Card>);
    const card = screen.getByText('Hover Card');
    expect(card).toHaveClass('transition-all', 'duration-200', 'hover:-translate-y-1', 'hover:border-[#c7b89c]', 'hover:shadow-card');
  });

  it('should accept custom className', () => {
    render(<Card className="custom-card">Custom</Card>);
    const card = screen.getByText('Custom');
    expect(card).toHaveClass('custom-card');
  });

  it('should forward ref to div element', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<Card ref={ref}>With Ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should support HTML attributes', () => {
    render(
      <Card 
        data-testid="test-card"
        aria-label="Test Card"
        role="article"
      >
        Test
      </Card>
    );
    const card = screen.getByTestId('test-card');
    expect(card).toHaveAttribute('aria-label', 'Test Card');
    expect(card).toHaveAttribute('role', 'article');
  });

  it('should render as a div element', () => {
    render(<Card>Div Card</Card>);
    const card = screen.getByText('Div Card');
    expect(card.tagName).toBe('DIV');
  });

  it('should combine hover and custom classes', () => {
    render(
      <Card hover className="rounded-lg shadow-lg">
        Combined
      </Card>
    );
    const card = screen.getByText('Combined');
    
    // Check hover styles
    expect(card).toHaveClass('hover:-translate-y-1');
    // Check custom classes
    expect(card).toHaveClass('rounded-lg', 'shadow-lg');
  });

  it('should handle onClick events', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable Card</Card>);
    const card = screen.getByText('Clickable Card');
    
    card.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should support nested content', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card description</p>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
  });

  it('should maintain editorial styling with sharp corners', () => {
    // Card should not have rounded classes by default (sharp corners)
    render(<Card>Sharp Corners</Card>);
    const card = screen.getByText('Sharp Corners');
    
    // Check it doesn't have rounded corners
    expect(card.className).not.toContain('rounded');
  });
});
