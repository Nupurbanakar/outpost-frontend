import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/Input';

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should apply text type by default', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should support different input types', () => {
    const { rerender } = render(<Input type="email" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="password" data-testid="password" />);
    input = screen.getByTestId('password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should apply error styles when error is true', () => {
    render(<Input error />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-rose-500', 'focus:border-rose-500');
  });

  it('should apply normal styles by default', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-[#ddd6c9]');
  });

  it('should handle value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'test');
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:bg-gray-100', 'disabled:cursor-not-allowed');
  });

  it('should not accept input when disabled', async () => {
    const user = userEvent.setup();
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'test');
    expect(input).toHaveValue('');
  });

  it('should accept custom className', () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });

  it('should forward ref to input element', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should support controlled input', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Input value="initial" readOnly />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveValue('initial');

    rerender(<Input value="updated" readOnly />);
    input = screen.getByRole('textbox');
    expect(input).toHaveValue('updated');
  });

  it('should support placeholder', () => {
    render(<Input placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('should support required attribute', () => {
    render(<Input required />);
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('should support aria attributes', () => {
    render(
      <Input 
        aria-label="Email address" 
        aria-describedby="email-error"
        aria-invalid="true"
      />
    );
    const input = screen.getByRole('textbox', { name: /email address/i });
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should support name and id attributes', () => {
    render(<Input name="email" id="email-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('should have consistent height', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('h-12');
  });

  it('should combine error and custom classes', () => {
    render(<Input error className="my-custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-rose-500', 'my-custom-class');
  });
});
