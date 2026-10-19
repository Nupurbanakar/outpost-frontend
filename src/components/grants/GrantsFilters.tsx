import { Stage, Sector } from '@/types';
import { GrantIssuingBodyType, GrantType, AmountBand, DeadlineFilter } from '@/types/enums';

interface GrantsFiltersProps {
  issuingBodyType: string;
  type: string;
  stageId: string;
  sectorId: string;
  amountBand: string;
  deadline: string;
  stages: Stage[];
  sectors: Sector[];
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function GrantsFilters({
  issuingBodyType,
  type,
  stageId,
  sectorId,
  amountBand,
  deadline,
  stages,
  sectors,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: GrantsFiltersProps) {
  return (
    <div className="mb-6 p-6 bg-paper-light border border-line">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Issuing Body Type */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Issuing Body
          </label>
          <select
            value={issuingBodyType}
            onChange={(e) => onFilterChange('issuingBodyType', e.target.value)}
            className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
          >
            <option value="">All</option>
            <option value={GrantIssuingBodyType.CENTRAL}>Central Government</option>
            <option value={GrantIssuingBodyType.STATE}>State Government</option>
            <option value={GrantIssuingBodyType.OTHER}>Other</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
          >
            <option value="">All</option>
            <option value={GrantType.GRANT}>Grant</option>
            <option value={GrantType.SUBSIDY}>Subsidy</option>
            <option value={GrantType.SCHEME}>Scheme</option>
            <option value={GrantType.INCENTIVE}>Incentive</option>
          </select>
        </div>

        {/* Stage */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Stage
          </label>
          <select
            value={stageId}
            onChange={(e) => onFilterChange('stageId', e.target.value)}
            className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
          >
            <option value="">All stages</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sector */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Sector
          </label>
          <select
            value={sectorId}
            onChange={(e) => onFilterChange('sectorId', e.target.value)}
            className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
          >
            <option value="">All sectors</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Band */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Amount
          </label>
          <select
            value={amountBand}
            onChange={(e) => onFilterChange('amountBand', e.target.value)}
            className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
          >
            <option value="">Any amount</option>
            <option value={AmountBand.UNDER_10L}>Under ₹10L</option>
            <option value={AmountBand.TEN_L_TO_50L}>₹10L - ₹50L</option>
            <option value={AmountBand.FIFTY_L_TO_1CR}>₹50L - ₹1Cr</option>
            <option value={AmountBand.OVER_1CR}>Over ₹1Cr</option>
          </select>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Deadline
          </label>
          <select
            value={deadline}
            onChange={(e) => onFilterChange('deadline', e.target.value)}
            className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
          >
            <option value="">All</option>
            <option value={DeadlineFilter.OPEN_NOW}>Open now</option>
            <option value={DeadlineFilter.CLOSING_THIS_MONTH}>Closing this month</option>
            <option value={DeadlineFilter.ROLLING}>Rolling</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mt-4">
          <button
            onClick={onClearFilters}
            className="text-sm text-muted-text hover:text-ink underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
