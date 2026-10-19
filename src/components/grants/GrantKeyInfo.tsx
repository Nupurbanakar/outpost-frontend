import { Calendar, IndianRupee, Tag } from 'lucide-react';
import { KeyInfoCard } from '@/components/common/KeyInfoCard';
import { Grant } from '@/api/endpoints/grants';
import { formatDate } from '@/utils/dateUtils';
import { formatAmount } from '@/utils/formatters';

interface GrantKeyInfoProps {
  grant: Grant;
}

export function GrantKeyInfo({ grant }: GrantKeyInfoProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Amount */}
      <KeyInfoCard icon={IndianRupee} label="Amount">
        {grant.amountMin && grant.amountMax
          ? `₹${formatAmount(grant.amountMin)} - ₹${formatAmount(grant.amountMax)}`
          : grant.amountMin
          ? `Up to ₹${formatAmount(grant.amountMin)}`
          : 'Undisclosed'}
      </KeyInfoCard>

      {/* Deadline */}
      <KeyInfoCard icon={Calendar} label="Deadline">
        {grant.deadline ? formatDate(grant.deadline) : 'Rolling'}
      </KeyInfoCard>

      {/* Eligible Stages */}
      {grant.eligibleStages && grant.eligibleStages.length > 0 && (
        <KeyInfoCard icon={Tag} label="Stages">
          <div className="flex flex-wrap gap-1">
            {grant.eligibleStages.map((stage) => (
              <span
                key={stage.id}
                className="text-xs px-2 py-1 bg-[#f5f3ed] text-ink"
              >
                {stage.name}
              </span>
            ))}
          </div>
        </KeyInfoCard>
      )}

      {/* Eligible Sectors */}
      {grant.eligibleSectors && grant.eligibleSectors.length > 0 && (
        <KeyInfoCard icon={Tag} label="Sectors">
          <div className="flex flex-wrap gap-1">
            {grant.eligibleSectors.map((sector) => (
              <span
                key={sector.id}
                className="text-xs px-2 py-1 bg-[#f5f3ed] text-ink"
              >
                {sector.name}
              </span>
            ))}
          </div>
        </KeyInfoCard>
      )}
    </div>
  );
}
