import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarded?: boolean;
}

/**
 * ProtectedRoute - Protects routes that require authentication
 * 
 * Redirects:
 * - Unauthenticated → /login
 * - Unverified → /verify-email (TODO: when backend supports it)
 * - Not onboarded → /onboarding
 */
export function ProtectedRoute({ 
  children, 
  requireOnboarded = true 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

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

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // TODO: Add email verification check when backend supports it
  // if (requireVerified && !user?.emailVerified) {
  //   return <Navigate to="/verify-email" replace />;
  // }

  // Check if user has completed onboarding
  if (requireOnboarded && user) {
    // Check the onboarded flag first (most reliable)
    const isOnboarded = user.onboarded || !!(user.startupName && user.stage && user.sector);
    if (!isOnboarded) {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
}
