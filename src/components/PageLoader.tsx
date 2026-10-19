import { LoadingSpinner } from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
}

/**
 * PageLoader - Full page loading state
 */
export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-muted-text">{message}</p>
      </div>
    </div>
  );
}
