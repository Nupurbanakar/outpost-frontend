import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Mentor } from '@/api/endpoints/mentors';

interface MentorCardProps {
  mentor: Mentor;
  variant?: 'light' | 'dark';
  showAiReason?: boolean;
}

export function MentorCard({ mentor, variant = 'dark', showAiReason = false }: MentorCardProps) {
  const darkMode = variant === 'dark';
  const bgColor = darkMode ? 'bg-[#1f2b25]' : 'bg-paper-light';
  const borderColor = darkMode ? 'border-[#2d3d35]' : 'border-line';
  const textColor = darkMode ? 'text-[#e8f0ed]' : 'text-ink';
  const mutedColor = darkMode ? 'text-[#a8b5af]' : 'text-muted-text';
  const tagBg = darkMode ? 'bg-[#2d3d35]' : 'bg-[#f5f3ed]';
  const tagText = darkMode ? 'text-[#a8b5af]' : 'text-muted-text';

  return (
    <Link
      to={`/mentors/${mentor.id}`}
      className={`block group ${bgColor} border ${borderColor} p-6 hover:shadow-xl transition-all duration-200 relative`}
    >
      {/* Photo */}
      <div className="mb-4">
        {mentor.photoUrl ? (
          <img
            src={mentor.photoUrl}
            alt={mentor.name}
            className="w-20 h-20 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${
              darkMode ? 'bg-[#2d3d35] text-[#6b8073]' : 'bg-[#f5f3ed] text-[#b58c4f]'
            }`}
          >
            {mentor.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
        )}
      </div>

      {/* Name */}
      <h3
        className={`text-xl font-serif font-bold ${textColor} mb-1 group-hover:text-[#6b8073] transition-colors`}
      >
        {mentor.name}
      </h3>

      {/* Headline (Role) */}
      <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-[#6b8073]' : 'text-[#2d6a4f]'}`}>
        {mentor.headline}
      </p>

      {/* Bio (truncated) */}
      <p className={`text-sm ${mutedColor} mb-4 line-clamp-2`}>{mentor.bio}</p>

      {/* Expertise Tags */}
      {mentor.expertise && mentor.expertise.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {mentor.expertise.slice(0, 3).map((tag, index) => (
            <span key={index} className={`px-2 py-1 ${tagBg} ${tagText} text-xs font-medium`}>
              {tag}
            </span>
          ))}
          {mentor.expertise.length > 3 && (
            <span className={`px-2 py-1 ${tagBg} ${tagText} text-xs font-medium`}>
              +{mentor.expertise.length - 3}
            </span>
          )}
        </div>
      )}

      {/* AI Reason */}
      {showAiReason && mentor.aiReason && (
        <div className="mb-4 p-3 bg-[#f0f9f4] border border-[#95d5b2] rounded">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#2d6a4f] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#2d6a4f]">
              <span className="font-semibold">Why this matches:</span> {mentor.aiReason}
            </p>
          </div>
        </div>
      )}

      {/* Arrow Button */}
      <div className="flex justify-end">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            darkMode
              ? 'bg-[#2d3d35] group-hover:bg-[#6b8073]'
              : 'bg-[#f5f3ed] group-hover:bg-[#b58c4f]'
          } transition-colors`}
        >
          <ArrowRight
            className={`w-5 h-5 ${
              darkMode
                ? 'text-[#a8b5af] group-hover:text-white'
                : 'text-[#b58c4f] group-hover:text-white'
            } transition-colors`}
          />
        </div>
      </div>
    </Link>
  );
}
