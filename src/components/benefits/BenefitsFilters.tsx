import { Search, X, Sparkles, Eye, EyeOff } from 'lucide-react';

interface BenefitsFiltersProps {
  category: string;
  partner: string;
  query: string;
  includeExpired: boolean;
  aiEnabled: boolean;
  canUseAI: boolean;
  categories: string[];
  partners: string[];
  onFilterChange: (key: string, value: string) => void;
  onToggleExpired: () => void;
  onToggleAI: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function BenefitsFilters({
  category,
  partner,
  query,
  includeExpired,
  aiEnabled,
  canUseAI,
  categories,
  partners,
  onFilterChange,
  onToggleExpired,
  onToggleAI,
  onClearFilters,
  hasActiveFilters,
}: BenefitsFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onFilterChange('q', e.target.value)}
          placeholder="Search benefits by keyword..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Partner */}
        <select
          value={partner}
          onChange={(e) => onFilterChange('partner', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Partners</option>
          {partners.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Show Expired Toggle */}
        <button
          onClick={onToggleExpired}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            includeExpired
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {includeExpired ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {includeExpired ? 'Hiding Expired' : 'Show Expired'}
        </button>

        {/* AI Toggle */}
        {canUseAI && (
          <button
            onClick={onToggleAI}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              aiEnabled
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            AI Recommendations
          </button>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
