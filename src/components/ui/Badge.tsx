import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'grant' | 'challenge' | 'scheme' | 'tag' | 'default';
}

/**
 * Badge component for category and status indicators
 * 
 * @example
 * <Badge variant="grant">Grant</Badge>
 * <Badge variant="challenge">Challenge</Badge>
 * <Badge variant="scheme">Scheme</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center px-2 py-1 text-xs font-medium mono-label';
    
    const variants = {
      grant: 'bg-[#f1e6d2] text-[#80591f]',
      challenge: 'bg-[#e2ece5] text-[#376b58]',
      scheme: 'bg-[#f0dfdc] text-[#925651]',
      tag: 'bg-[#f2efe8] text-[#6f7478]',
      default: 'bg-paper text-muted-text',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
