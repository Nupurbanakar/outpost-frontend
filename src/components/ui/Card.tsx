import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

/**
 * Card component for content containers
 * Follows Outpost design system with sharp corners and editorial styling
 * 
 * @example
 * <Card>Content</Card>
 * <Card hover>Hoverable card</Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, ...props }, ref) => {
    const baseStyles = 'bg-[#fffdf8] border border-[#ded8cc] p-5';
    
    const hoverStyles = hover
      ? 'transition-all duration-200 hover:-translate-y-1 hover:border-[#c7b89c] hover:shadow-card'
      : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, hoverStyles, className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
