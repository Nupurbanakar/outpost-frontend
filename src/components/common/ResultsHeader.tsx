import { Sparkles } from 'lucide-react';

interface ResultsHeaderProps {
  count: number;
  total: number;
  itemName: string; // 'grant', 'challenge', 'mentor', 'candidate', etc.
  aiEnabled?: boolean;
  aiMessage?: string;
}

/**
 * Standardized results header showing count and optional AI badge
 * Follows Outpost design system
 */
export function ResultsHeader({
  count,
  total,
  itemName,
  aiEnabled = false,
  aiMessage = 'AI-ranked for your startup',
}: ResultsHeaderProps) {
  const itemNamePlural = total === 1 ? itemName : `${itemName}s`;
  
  return (
    <div className="mb-6 flex items-center justify-between">
      <p className="text-sm text-muted-text">
        {count === total ? (
          <>
            <span className="font-semibold text-ink">{total}</span> {itemNamePlural} found
          </>
        ) : (
          <>
            Showing <span className="font-semibold text-ink">{count}</span> of{' '}
            <span className="font-semibold text-ink">{total}</span> {itemNamePlural}
          </>
        )}
      </p>
      {aiEnabled && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f9f4] border border-[#95d5b2] text-[#2d6a4f] text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{aiMessage}</span>
        </div>
      )}
    </div>
  );
}
