import { Link } from 'react-router-dom';
import { Bookmark, IndianRupee, Calendar, Sparkles, Building2 } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { useBookmark } from '@/hooks/useBookmark';

type OpportunityType = 'GRANT' | 'CHALLENGE';

interface OpportunityCardProps {
  type: OpportunityType;
  id: string;
  title: string;
  organization: string;
  logo?: string;
  description?: string;
  sector?: string;
  amount?: string;
  deadline?: string;
  status?: string;
  aiReason?: string;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
}

export function OpportunityCard({
  type,
  id,
  title,
  organization,
  logo,
  description,
  sector,
  amount,
  deadline,
  status,
  aiReason,
  onBookmark,
  isBookmarked = false,
}: OpportunityCardProps) {
  const isGrant = type === 'GRANT';
  const expired = status === 'EXPIRED' || status === 'CLOSED';
  const link = isGrant ? `/grants/${id}` : `/challenges/${id}`;
  
  // Check if deadline is within 7 days
  const isClosingSoon = deadline && !expired ? (() => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  })() : false;
  
  // Use bookmark hook
  const bookmarkType = isGrant ? 'grant' : 'challenge';
  const { bookmarked, toggle: toggleBookmark } = useBookmark(id, bookmarkType);
  
  // Use prop if provided, otherwise use hook state
  const isBookmarkedFinal = onBookmark ? isBookmarked : bookmarked;
  const handleBookmark = onBookmark || toggleBookmark;

  return (
    <div
      className={`group relative bg-paper-light border border-line hover:shadow-lg transition-all duration-200 flex flex-col h-full ${
        expired ? 'opacity-60' : ''
      }`}
    >
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-start justify-between mb-4">
          {/* Category Badge and Closing Soon Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide border ${
                isGrant
                  ? 'bg-[#f0f9f4] text-[#2d6a4f] border-[#95d5b2]'
                  : 'bg-[#fef3e2] text-[#b58c4f] border-[#f4d8a8]'
              }`}
            >
              {isGrant ? 'Grant' : 'Challenge'}
            </span>
            
            {/* Closing Soon Badge */}
            {isClosingSoon && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-red-500 text-white rounded">
                {/* Simple pulsing dot - no outer ring */}
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                <span>Closing Soon</span>
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleBookmark(id);
            }}
            className="p-2 hover:bg-[#f5f3ed] rounded transition-colors"
            aria-label={isBookmarkedFinal ? 'Remove bookmark' : 'Bookmark'}
          >
            <Bookmark
              className={`w-4 h-4 ${
                isBookmarkedFinal ? 'fill-[#b58c4f] text-[#b58c4f]' : 'text-muted-text'
              }`}
            />
          </button>
        </div>

        {/* Logo and Organization */}
        <div className="flex items-center gap-3 mb-3">
          {logo ? (
            <img src={logo} alt={organization} className="w-10 h-10 object-contain" />
          ) : (
            <div className="w-10 h-10 bg-[#f5f3ed] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-muted-text" />
            </div>
          )}
          <p className="text-xs font-medium text-muted-text uppercase tracking-wide">
            {organization}
          </p>
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-bold text-ink mb-3 group-hover:text-[#b58c4f] transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Description or Sector */}
        {(description || sector) && (
          <p className="text-sm text-muted-text line-clamp-2 mb-4">
            {description || sector}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto p-6 pt-4 border-t border-line">
        {/* Amount & Deadline */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-ink font-medium">
            <IndianRupee className="w-4 h-4 text-[#b58c4f]" />
            <span>{amount || 'See details'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-text">
            <Calendar className="w-4 h-4" />
            <span>
              {deadline ? (expired ? 'Expired' : formatDate(deadline)) : 'Rolling'}
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
      {aiReason && (
        <div className="mx-6 mb-6 mt-2 p-3 bg-[#f0f9f4] border border-[#95d5b2] rounded">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#2d6a4f] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#2d6a4f]">
              <span className="font-semibold">Why this matches:</span> {aiReason}
            </p>
          </div>
        </div>
      )}

      {/* Expired/Closed Banner */}
      {expired && (
        <div className="absolute top-0 left-0 right-0 bg-rose-500 text-white text-xs font-semibold text-center py-1">
          {status === 'CLOSED' ? 'CLOSED' : 'EXPIRED'}
        </div>
      )}
    </div>
  );
}
