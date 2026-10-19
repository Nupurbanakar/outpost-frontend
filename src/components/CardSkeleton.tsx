import { Skeleton } from './ui/Skeleton';

/**
 * CardSkeleton - Skeleton for opportunity/mentor cards
 */
export function CardSkeleton() {
  return (
    <div className="bg-[#fffdf8] border border-[#ded8cc] p-5 space-y-4">
      {/* Badge */}
      <Skeleton className="h-5 w-20" />
      
      {/* Title */}
      <Skeleton className="h-6 w-3/4" />
      
      {/* Description lines */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      
      {/* Footer info */}
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
