import { LucideIcon } from 'lucide-react';
import { Button } from './ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * EmptyState - Shows when no data is available
 */
export function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-line bg-paper-light mb-4">
        <Icon className="w-8 h-8 text-muted-text" />
      </div>
      
      <h3 className="text-lg font-bold text-ink mb-2">{title}</h3>
      
      <p className="text-muted-text mb-6 max-w-sm">{message}</p>

      {action && (
        <Button onClick={action.onClick} variant="secondary">
          {action.label}
        </Button>
      )}
    </div>
  );
}
