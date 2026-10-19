interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No results found',
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <p className="text-lg text-muted-text mb-4">{title}</p>
      {description && (
        <p className="text-sm text-muted-text mb-6">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-[#b58c4f] hover:underline font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
