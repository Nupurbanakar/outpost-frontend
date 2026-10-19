import { useState, useEffect } from 'react';
import { useSectors } from '@/hooks/useSectors';
import { challengesApi } from '@/api/endpoints/challenges';
import { Sparkles } from 'lucide-react';

interface ChallengesFiltersPanelProps {
  selectedSectorId?: string;
  selectedTheme?: string;
  selectedCorporate?: string;
  selectedStatus?: 'OPEN' | 'CLOSED';
  aiEnabled: boolean;
  onFilterChange: (key: string, value: string | boolean | null) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function ChallengesFiltersPanel({
  selectedSectorId,
  selectedTheme,
  selectedCorporate,
  selectedStatus,
  aiEnabled,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
}: ChallengesFiltersPanelProps) {
  const { sectors, isLoading: sectorsLoading } = useSectors();
  const [themes, setThemes] = useState<string[]>([]);
  const [themesLoading, setThemesLoading] = useState(true);

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const data = await challengesApi.getThemes();
        setThemes(data);
      } catch (err) {
        console.error('Failed to load themes:', err);
      } finally {
        setThemesLoading(false);
      }
    };

    loadThemes();
  }, []);

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <span className="text-sm text-muted-text">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
          </span>
          <button
            onClick={onClearFilters}
            className="text-sm text-ink font-semibold hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* AI Toggle */}
      <div className="pb-6 border-b border-line">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={aiEnabled}
            onChange={(e) => onFilterChange('ai', e.target.checked)}
            className="w-5 h-5 border-2 border-line checked:bg-ink checked:border-ink focus:ring-2 focus:ring-ink focus:ring-offset-2"
          />
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-ink" />
            <span className="font-semibold text-ink group-hover:underline">
              AI-Ranked Results
            </span>
          </div>
        </label>
        <p className="text-xs text-muted-text mt-2 ml-8">
          Get challenges ranked by relevance to your profile
        </p>
      </div>

      {/* Status Filter */}
      <div className="pb-6 border-b border-line">
        <h3 className="font-semibold text-ink mb-3">Status</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={!selectedStatus}
              onChange={() => onFilterChange('status', null)}
              className="w-4 h-4"
            />
            <span className="text-sm text-muted-text">All</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="OPEN"
              checked={selectedStatus === 'OPEN'}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-muted-text">Open</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="CLOSED"
              checked={selectedStatus === 'CLOSED'}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-muted-text">Closed</span>
          </label>
        </div>
      </div>

      {/* Sector Filter */}
      <div className="pb-6 border-b border-line">
        <h3 className="font-semibold text-ink mb-3">Sector</h3>
        {sectorsLoading ? (
          <p className="text-sm text-muted-text">Loading sectors...</p>
        ) : (
          <select
            value={selectedSectorId || ''}
            onChange={(e) => onFilterChange('sectorId', e.target.value || null)}
            className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
          >
            <option value="">All Sectors</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Theme Filter */}
      <div className="pb-6 border-b border-line">
        <h3 className="font-semibold text-ink mb-3">Theme</h3>
        {themesLoading ? (
          <p className="text-sm text-muted-text">Loading themes...</p>
        ) : (
          <select
            value={selectedTheme || ''}
            onChange={(e) => onFilterChange('theme', e.target.value || null)}
            className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
          >
            <option value="">All Themes</option>
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Corporate Filter */}
      <div>
        <h3 className="font-semibold text-ink mb-3">Corporate</h3>
        <input
          type="text"
          value={selectedCorporate || ''}
          onChange={(e) => onFilterChange('corporate', e.target.value || null)}
          placeholder="Filter by corporate name"
          className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
        />
      </div>
    </div>
  );
}
