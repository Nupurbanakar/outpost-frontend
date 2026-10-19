import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/**
 * Input component following Outpost design system
 * 
 * @example
 * <Input placeholder="Enter email" />
 * <Input type="password" error />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error = false, ...props }, ref) => {
    const baseStyles = 'block w-full px-3 py-2 h-12 bg-[#fffdf8] border text-ink text-sm transition-all';
    const normalStyles = 'border-[#ddd6c9] focus:border-[#b58c4f] focus:ring-2 focus:ring-[rgba(214,155,66,0.12)] focus:outline-none';
    const errorStyles = 'border-rose-500 focus:border-rose-500 focus:ring-rose-200';
    const disabledStyles = 'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50';

    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          error ? errorStyles : normalStyles,
          disabledStyles,
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
