import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, Sparkles } from 'lucide-react';
import type { Candidate } from '@/api/endpoints/candidates';

interface CandidateCardProps {
  candidate: Candidate;
}

const experienceLevelLabels = {
  ENTRY: 'Entry Level',
  MID: 'Mid Level',
  SENIOR: 'Senior',
  LEAD: 'Lead/Principal',
};

const availabilityLabels = {
  IMMEDIATE: 'Immediate',
  TWO_WEEKS: '2 Weeks Notice',
  ONE_MONTH: '1 Month Notice',
  FLEXIBLE: 'Flexible',
};

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Link
      to={`/talent/${candidate.id}`}
      className="group block bg-white border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
    >
      {/* Name and Role */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {candidate.name}
        </h3>
        <p className="text-sm text-gray-600">{candidate.role}</p>
      </div>

      {/* Experience Level */}
      <div className="mb-3">
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {experienceLevelLabels[candidate.experienceLevel]}
        </span>
      </div>

      {/* Location and Availability */}
      <div className="mb-4 space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span>{candidate.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>{availabilityLabels[candidate.availability]}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-3 flex flex-wrap gap-2">
        {candidate.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
          >
            {skill}
          </span>
        ))}
        {candidate.skills.length > 4 && (
          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
            +{candidate.skills.length - 4} more
          </span>
        )}
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-600 line-clamp-2">{candidate.summary}</p>

      {/* AI Reason */}
      {candidate.aiReason && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800">
          <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{candidate.aiReason}</span>
        </div>
      )}
    </Link>
  );
}
