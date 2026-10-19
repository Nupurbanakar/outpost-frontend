import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { spotlightApi, SpotlightFounder } from '@/api/endpoints/spotlight';
import { Star, ArrowRight } from 'lucide-react';

export function SpotlightSection() {
  const [spotlight, setSpotlight] = useState<SpotlightFounder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const data = await spotlightApi.getCurrentSpotlight();
        setSpotlight(data);
      } catch (error) {
        console.error('Failed to fetch spotlight:', error);
        setSpotlight(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotlight();
  }, []);

  // Don't render anything if loading or no spotlight
  if (isLoading || !spotlight) {
    return null;
  }

  return (
    <section className="mb-16">
      {/* Section Label */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-[#b58c4f]" />
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-text">
            Founder of the Day
          </p>
        </div>
        <h2 className="text-3xl font-serif font-bold text-ink">Meet {spotlight.founderName}</h2>
      </div>

      {/* Spotlight Card */}
      <Link
        to={`/founders/${spotlight.id}`}
        className="block group bg-gradient-to-br from-[#f5f3ed] to-[#e8e5d8] border border-line p-8 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Photo */}
          <div className="flex-shrink-0">
            {spotlight.photoUrl ? (
              <img
                src={spotlight.photoUrl}
                alt={spotlight.founderName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold text-[#b58c4f]">
                {spotlight.founderName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-serif font-bold text-ink mb-2 group-hover:text-[#b58c4f] transition-colors">
              {spotlight.founderName}
            </h3>
            <p className="text-lg font-semibold text-[#2d6a4f] mb-3">{spotlight.startupName}</p>
            <p className="text-muted-text mb-4">{spotlight.oneLiner}</p>

            {/* CTA */}
            <div className="inline-flex items-center gap-2 text-ink font-semibold group-hover:gap-3 transition-all">
              <span>View Profile</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
