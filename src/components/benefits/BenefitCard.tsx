import { Link } from 'react-router-dom';
import { Calendar, Star, Sparkles } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import type { Benefit } from '@/api/endpoints/benefits';

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  const isExpired = benefit.status === 'EXPIRED';
  const hasValidUntil = benefit.validUntil && !isExpired;

  return (
    <Link
      to={`/benefits/${benefit.id}`}
      className={`group relative block bg-white border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 ${
        isExpired ? 'opacity-60' : ''
      }`}
    >
      {/* Featured badge */}
      {benefit.featured && !isExpired && (
        <div className="absolute top-4 right-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          <Star className="inline h-3 w-3 mr-1" />
          Featured
        </div>
      )}

      {/* Partner Logo */}
      <div className="mb-4">
        {benefit.partnerLogoUrl ? (
          <img
            src={benefit.partnerLogoUrl}
            alt={benefit.partnerName}
            className="h-12 object-contain"
          />
        ) : (
          <div className="h-12 flex items-center">
            <span className="text-sm font-medium text-gray-500">{benefit.partnerName}</span>
          </div>
        )}
      </div>

      {/* Category */}
      <div className="mb-2">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
          {benefit.category}
        </span>
      </div>

      {/* Headline */}
      <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
        {benefit.headline}
      </h3>

      {/* Description */}
      <p className="mb-4 text-sm text-gray-600 line-clamp-2">{benefit.description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {hasValidUntil && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Valid until {formatDate(benefit.validUntil!)}</span>
          </div>
        )}
        {isExpired && (
          <span className="text-red-600 font-medium">Expired</span>
        )}
      </div>

      {/* AI Reason */}
      {benefit.aiReason && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800">
          <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{benefit.aiReason}</span>
        </div>
      )}
    </Link>
  );
}
