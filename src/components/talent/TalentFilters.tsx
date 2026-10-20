import { Search, X, Sparkles } from 'lucide-react';

interface TalentFiltersProps {
  role: string;
  selectedSkills: string[];
  experienceLevel: string;
  location: string;
  availability: string;
  query: string;
  aiEnabled: boolean;
  canUseAI: boolean;
  roles: string[];
  skills: string[];
  onFilterChange: (key: string, value: string) => void;
  onSkillsChange: (skills: string[]) => void;
  onToggleAI: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function TalentFilters({
  role,
  selectedSkills,
  experienceLevel,
  location,
  availability,
  query,
  aiEnabled,
  canUseAI,
  roles,
  skills,
  onFilterChange,
  onSkillsChange,
  onToggleAI,
  onClearFilters,
  hasActiveFilters,
}: TalentFiltersProps) {
  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter((s) => s !== skill));
    } else {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onFilterChange('q', e.target.value)}
          placeholder="Search candidates by name, role, or skills..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Role */}
        <select
          value={role}
          onChange={(e) => onFilterChange('role', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Experience Level */}
        <select
          value={experienceLevel}
          onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Experience Levels</option>
          <option value="ENTRY">Entry Level</option>
          <option value="MID">Mid Level</option>
          <option value="SENIOR">Senior</option>
          <option value="LEAD">Lead/Principal</option>
        </select>

        {/* Location */}
        <input
          type="text"
          value={location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          placeholder="Location"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {/* Availability */}
        <select
          value={availability}
          onChange={(e) => onFilterChange('availability', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Any Availability</option>
          <option value="IMMEDIATE">Immediate</option>
          <option value="TWO_WEEKS">2 Weeks Notice</option>
          <option value="ONE_MONTH">1 Month Notice</option>
          <option value="FLEXIBLE">Flexible</option>
        </select>

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
            AI Match
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

      {/* Skills Filter */}
      {skills.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Filter by Skills:</label>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 20).map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
