import { AlertCircle } from 'lucide-react';
import { parseApiError } from '@/utils/errorHandling';

interface ApiErrorDisplayProps {
  error: any;
  className?: string;
}

/**
 * ApiErrorDisplay - Shows API errors with appropriate messaging
 */
export function ApiErrorDisplay({ error, className = '' }: ApiErrorDisplayProps) {
  const message = parseApiError(error);

  return (
    <div className={`flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-800 ${className}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
