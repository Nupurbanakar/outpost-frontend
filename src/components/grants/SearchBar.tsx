import { Search, Sparkles } from 'lucide-react';

interface SearchBarProps {
  query?: string;
  onQueryChange?: (value: string) => void;
  aiEnabled?: boolean;
  canUseAI?: boolean;
  onToggleAI?: () => void;
  // Alternative props for simple search (used by ChallengesPage, MentorsPage)
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  query,
  onQueryChange,
  aiEnabled = false,
  canUseAI = false,
  onToggleAI,
  value,
  onChange,
  placeholder = 'Search...',
}: SearchBarProps) {
  // Support both prop patterns
  const searchValue = value !== undefined ? value : query ?? '';
  const handleChange = onChange || onQueryChange || (() => {});
  
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-line focus:border-[#b58c4f] focus:ring-2 focus:ring-[rgba(214,155,66,0.12)] focus:outline-none bg-paper-light text-ink"
        />
      </div>

      {/* AI Toggle */}
      {canUseAI && (
        <button
          onClick={onToggleAI}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            aiEnabled
              ? 'bg-[#f0f9f4] text-[#2d6a4f] border-2 border-[#2d6a4f]'
              : 'bg-paper-light text-muted-text border-2 border-line hover:border-ink'
          }`}
          aria-label={aiEnabled ? 'Disable AI recommendations' : 'Enable AI recommendations'}
        >
          <Sparkles className="w-5 h-5" />
          <span>AI recommendations</span>
        </button>
      )}
    </div>
  );
}
