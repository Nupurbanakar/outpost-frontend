import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton component for loading states
 * Shows animated placeholder while content loads
 * 
 * @example
 * <Skeleton className="h-4 w-32" />
 * <Skeleton className="h-20 w-full rounded" />
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('animate-pulse bg-[#e8e4da]', className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
