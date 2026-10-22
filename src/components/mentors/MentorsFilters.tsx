import { useState, useEffect } from 'react';
import { useSectors } from '@/hooks/useSectors';
import { useStages } from '@/hooks/useStages';
import { Sparkles } from 'lucide-react';

// Common expertise areas for mentors
const EXPERTISE_OPTIONS = [
  'Product',
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Fundraising',
  'Operations',
  'Strategy',
  'Legal',
  'Finance',
  'HR',
  'Growth',
];

interface MentorsFiltersPanelProps {
  selectedStageId?: string;
  selectedSectorId?: string;
  selectedExpertise: string[];
  aiEnabled: boolean;
  onFilterChange: (key: string, value: string | string[] | boolean | null) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function MentorsFiltersPanel({
  selectedStageId,
  selectedSectorId,
  selectedExpertise,
  aiEnabled,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
}: MentorsFiltersPanelProps) {
  const { sectors, isLoading: sectorsLoading } = useSectors();
  const { stages, isLoading: stagesLoading } = useStages();

  const handleExpertiseToggle = (expertise: string) => {
    const newExpertise = selectedExpertise.includes(expertise)
      ? selectedExpertise.filter((e) => e !== expertise)
      : [...selectedExpertise, expertise];
    
    onFilterChange('expertise', newExpertise);
  };

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
          Get mentors ranked by relevance to your profile
        </p>
      </div>

      {/* Expertise Filter (Multi-select) */}
      <div className="pb-6 border-b border-line">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-ink">
            Expertise
            {selectedExpertise.length > 0 && (
              <span className="ml-2 text-xs font-normal text-muted-text">
                ({selectedExpertise.length} selected)
              </span>
            )}
          </h3>
          {selectedExpertise.length > 0 && (
            <button
              onClick={() => onFilterChange('expertise', [])}
              className="text-xs text-ink font-semibold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {EXPERTISE_OPTIONS.map((expertise) => (
            <label key={expertise} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedExpertise.includes(expertise)}
                onChange={() => handleExpertiseToggle(expertise)}
                className="w-4 h-4"
              />
              <span className="text-sm text-muted-text">{expertise}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stage Filter */}
      <div className="pb-6 border-b border-line">
        <h3 className="font-semibold text-ink mb-3">Stage</h3>
        {stagesLoading ? (
          <p className="text-sm text-muted-text">Loading stages...</p>
        ) : (
          <select
            value={selectedStageId || ''}
            onChange={(e) => onFilterChange('stageId', e.target.value || null)}
            className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
          >
            <option value="">All Stages</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Sector Filter */}
      <div>
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
    </div>
  );
}
