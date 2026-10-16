import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - For auth pages (login, signup, etc.)
 * Redirects authenticated users to /discover
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-text">Loading...</p>
        </div>
      </div>
    );
  }

  // Authenticated users should go to discover
  if (isAuthenticated) {
    return <Navigate to="/discover" replace />;
  }

  return <>{children}</>;
}
