import { AlertCircle } from 'lucide-react';
import { parseApiError, isErrorCode } from '@/utils/errorHandling';
import { Button } from './ui/Button';
import { useAuth } from '@/contexts';

interface ApiErrorDisplayProps {
  error: any;
  className?: string;
}

/**
 * ApiErrorDisplay - Shows API errors with appropriate messaging
 */
export function ApiErrorDisplay({ error, className = '' }: ApiErrorDisplayProps) {
  const { logout } = useAuth();
  const message = parseApiError(error);
  
  // Check if this is an auth session error
  const isAuthError = isErrorCode(error, 'AUTH_SESSION_ERROR') ||
                     message.includes('authentication issue') ||
                     message.includes('log out and log back in');

  return (
    <div className={`flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-800 ${className}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium mb-2">{message}</p>
        {isAuthError && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="mt-2 border-rose-300 text-rose-700 hover:bg-rose-100"
          >
            Log Out and Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
