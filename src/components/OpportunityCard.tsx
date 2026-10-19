import { Link } from 'react-router-dom';
import { Bookmark, IndianRupee, Calendar, Sparkles } from 'lucide-react';
import { Grant } from '@/api/endpoints/grants';
import { Challenge } from '@/api/endpoints/challenges';
import { formatDate } from '@/utils/dateUtils';
import { formatAmount } from '@/utils/formatters';

type OpportunityType = 'GRANT' | 'CHALLENGE';

interface OpportunityCardProps {
  opportunity: Grant | Challenge;
  type: OpportunityType;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
}

export function OpportunityCard({ opportunity, type, onBookmark, isBookmarked = false }: OpportunityCardProps) {
  const isGrant = type === 'GRANT';
  const grant = isGrant ? (opportunity as Grant) : null;
  const challenge = !isGrant ? (opportunity as Challenge) : null;

  const expired = isGrant 
    ? grant?.status === 'EXPIRED'
    : challenge?.status === 'CLOSED';

  const link = isGrant ? `/grants/${opportunity.id}` : `/challenges/${opportunity.id}`;

  // Get card details based on type
  const title = opportunity.title;
  const organization = isGrant ? grant?.issuingBody : challenge?.corporateName;
  const description = isGrant ? grant?.summary : challenge?.theme || '';
  const deadline = isGrant ? grant?.deadline : challenge?.deadline;
  
  // Amount/prize
  const amount = isGrant 
    ? (grant?.amountMin && grant?.amountMax 
        ? `₹${formatAmount(grant.amountMin)} - ₹${formatAmount(grant.amountMax)}`
        : grant?.amountMin 
          ? `Up to ₹${formatAmount(grant.amountMin)}`
          : 'Undisclosed')
    : challenge?.problemStatement 
      ? 'Pilot/POC opportunity'
      : 'See details';

  return (
    <div className={`group relative bg-paper-light border border-line hover:shadow-lg transition-all duration-200 flex flex-col h-full ${
      expired ? 'opacity-60' : ''
    }`}>
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-start justify-between mb-4">
          {/* Category Badge */}
          <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide border ${
            isGrant
              ? 'bg-[#f0f9f4] text-[#2d6a4f] border-[#95d5b2]'
              : 'bg-[#fef3e2] text-[#b58c4f] border-[#f4d8a8]'
          }`}>
            {isGrant ? 'Grant' : 'Challenge'}
          </span>

          {/* Bookmark Button */}
          {onBookmark && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onBookmark(opportunity.id);
              }}
              className="p-2 hover:bg-[#f5f3ed] rounded transition-colors"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <Bookmark 
                className={`w-4 h-4 ${isBookmarked ? 'fill-[#b58c4f] text-[#b58c4f]' : 'text-muted-text'}`}
              />
            </button>
          )}
        </div>

        {/* Organization */}
        <p className="text-xs font-medium text-muted-text uppercase tracking-wide mb-2">
          {organization}
        </p>

        {/* Title */}
        <h3 className="text-xl font-serif font-bold text-ink mb-3 group-hover:text-[#b58c4f] transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-text line-clamp-3 mb-4">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto p-6 pt-4 border-t border-line">
        {/* Amount & Deadline */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-ink font-medium">
            <IndianRupee className="w-4 h-4 text-[#b58c4f]" />
            <span>{amount}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-muted-text">
            <Calendar className="w-4 h-4" />
            <span>
              {deadline ? (
                expired ? 'Expired' : formatDate(deadline)
              ) : (
                'Rolling'
              )}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={link}
          className="block w-full text-center px-4 py-2.5 bg-ink text-paper-light text-sm font-semibold hover:bg-[#304258] transition-colors"
        >
          View {isGrant ? 'opportunity' : 'challenge'}
        </Link>
      </div>

      {/* AI Reason (if present) */}
      {opportunity.aiReason && (
        <div className="mx-6 mb-6 mt-2 p-3 bg-[#f0f9f4] border border-[#95d5b2] rounded">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#2d6a4f] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#2d6a4f]">
              <span className="font-semibold">Why this matches:</span> {opportunity.aiReason}
            </p>
          </div>
        </div>
      )}

      {/* Expired Banner */}
      {expired && (
        <div className="absolute top-0 left-0 right-0 bg-rose-500 text-white text-xs font-semibold text-center py-1">
          EXPIRED
        </div>
      )}
    </div>
  );
}
