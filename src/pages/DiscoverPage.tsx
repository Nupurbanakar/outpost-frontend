import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { OpportunityCard } from '@/components/OpportunityCard';
import { MentorCard } from '@/components/MentorCard';
import { grantsApi } from '@/api/endpoints/grants';
import { challengesApi } from '@/api/endpoints/challenges';
import { mentorsApi } from '@/api/endpoints/mentors';
import { Sparkles, TrendingUp, Users, Clock } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatAmount } from '@/utils/formatters';

interface Stats {
  openCalls: number;
  mentors: number;
  closingSoon: number;
}

export default function DiscoverPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        
        // Fetch stats in parallel
        const [grantStats, mentorsResponse] = await Promise.all([
          grantsApi.getStats(),
          mentorsApi.getMentors({ size: 1 }), // Just to get total count
        ]);

        setStats({
          openCalls: grantStats.openCalls,
          closingSoon: grantStats.closingSoon,
          mentors: mentorsResponse.page.totalElements,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Set default stats on error
        setStats({
          openCalls: 0,
          mentors: 0,
          closingSoon: 0,
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f3ed] border border-[#ddd6c9] rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#b58c4f]" />
            <span className="text-xs font-semibold tracking-wide uppercase text-ink">
              Curated for T-Hub Founders
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-ink mb-6 leading-tight">
            What will move your startup forward?
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-muted-text max-w-3xl leading-relaxed">
            Discover funding opportunities, challenges from corporates, and mentorship from founders who've built and scaled successful companies.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {/* Open Calls */}
          <div className="bg-paper-light border border-line p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#f5f3ed] rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#b58c4f]" />
              </div>
              {isLoadingStats && <LoadingSpinner size="sm" />}
            </div>
            <div className="text-4xl font-bold font-serif text-ink mb-2">
              {isLoadingStats ? '—' : stats?.openCalls || 0}
            </div>
            <div className="text-sm font-medium text-muted-text">
              Open calls
            </div>
            <p className="text-xs text-muted-text mt-1">
              Grants & funding opportunities
            </p>
          </div>

          {/* Mentors */}
          <div className="bg-paper-light border border-line p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#f5f3ed] rounded-lg">
                <Users className="w-6 h-6 text-[#b58c4f]" />
              </div>
              {isLoadingStats && <LoadingSpinner size="sm" />}
            </div>
            <div className="text-4xl font-bold font-serif text-ink mb-2">
              {isLoadingStats ? '—' : stats?.mentors || 0}
            </div>
            <div className="text-sm font-medium text-muted-text">
              Mentors
            </div>
            <p className="text-xs text-muted-text mt-1">
              Experienced founders & operators
            </p>
          </div>

          {/* Closing Soon */}
          <div className="bg-paper-light border border-line p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#f5f3ed] rounded-lg">
                <Clock className="w-6 h-6 text-[#b58c4f]" />
              </div>
              {isLoadingStats && <LoadingSpinner size="sm" />}
            </div>
            <div className="text-4xl font-bold font-serif text-ink mb-2">
              {isLoadingStats ? '—' : stats?.closingSoon || 0}
            </div>
            <div className="text-sm font-medium text-muted-text">
              Closing soon
            </div>
            <p className="text-xs text-muted-text mt-1">
              Deadlines within 30 days
            </p>
          </div>
        </div>

        {/* Section Divider */}
        <div className="border-t border-line mb-12" />

        {/* Opportunities Section (FE-017) */}
        <OpportunitiesSection />

        {/* Mentors Section (FE-018) */}
        <MentorsSection />
      </div>
    </AppLayout>
  );
}

/* Opportunities Section Component */
function OpportunitiesSection() {
  const [filter, setFilter] = useState<'ALL' | 'GRANT' | 'CHALLENGE'>('ALL');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        
        // Fetch grants and challenges in parallel
        const [grantsResponse, challengesResponse] = await Promise.all([
          grantsApi.getGrants({ size: 6 }),
          challengesApi.getChallenges({ status: 'OPEN', size: 6 }),
        ]);

        // Combine and sort by deadline
        const combined = [
          ...grantsResponse.content.map((g: any) => ({ ...g, opportunityType: 'GRANT' as const })),
          ...challengesResponse.content.map((c: any) => ({ ...c, opportunityType: 'CHALLENGE' as const })),
        ];

        // Sort by deadline (nulls last)
        combined.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });

        // Take first 6
        setOpportunities(combined.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
        setOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    if (filter === 'ALL') return true;
    return opp.opportunityType === filter;
  });

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-text mb-1">
            Open now
          </p>
          <h2 className="text-3xl font-serif font-bold text-ink">
            Opportunities for you
          </h2>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-8">
        {(['ALL', 'GRANT', 'CHALLENGE'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === filterType
                ? 'bg-ink text-paper-light'
                : 'bg-paper-light text-muted-text border border-line hover:border-ink'
            }`}
          >
            {filterType === 'ALL' ? 'All opportunities' : filterType === 'GRANT' ? 'Grants' : 'Challenges'}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-paper-light border border-line p-6 h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredOpportunities.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <p className="text-muted-text">No {filter === 'ALL' ? '' : filter.toLowerCase() + ' '}opportunities available right now.</p>
        </div>
      ) : (
        /* Opportunities Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredOpportunities.map((opp) => {
            const isGrant = opp.opportunityType === 'GRANT';
            return (
              <OpportunityCard
                key={opp.id}
                type={opp.opportunityType}
                id={opp.id}
                title={opp.title}
                organization={isGrant ? opp.issuingBody : opp.corporateName}
                logo={isGrant ? undefined : opp.corporateLogo}
                description={isGrant ? opp.summary : opp.theme}
                sector={isGrant ? opp.eligibleSectors?.[0]?.name : opp.sector?.name}
                amount={
                  isGrant
                    ? opp.amountMin && opp.amountMax
                      ? `₹${formatAmount(opp.amountMin)} - ₹${formatAmount(opp.amountMax)}`
                      : opp.amountMin
                      ? `Up to ₹${formatAmount(opp.amountMin)}`
                      : 'Undisclosed'
                    : 'See details'
                }
                deadline={opp.deadline}
                status={opp.status}
              />
            );
          })}
            />
          ))}
        </div>
      )}

      {/* Explore All CTA */}
      <div className="text-center">
        <Link
          to="/opportunities"
          className="inline-block px-6 py-3 bg-transparent border-2 border-ink text-ink font-semibold hover:bg-ink hover:text-paper-light transition-colors"
        >
          Explore all opportunities
        </Link>
      </div>
    </section>
  );
}

/* Mentors Section Component */
function MentorsSection() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        const response = await mentorsApi.getMentors({ size: 3 });
        setMentors(response.content);
      } catch (error) {
        console.error('Failed to fetch mentors:', error);
        setMentors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  return (
    <section className="bg-[#17231c] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-wide uppercase text-[#a8b5af] mb-2">
            Founder to founder
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Meet mentors who've been there
          </h2>
          <p className="text-lg text-[#a8b5af] max-w-2xl">
            Get guidance from operators, investors, and experts who've scaled startups and navigated the challenges you're facing.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1f2b25] border border-[#2d3d35] p-6 h-64 animate-pulse" />
            ))}
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#a8b5af]">No mentors available right now.</p>
          </div>
        ) : (
          /* Mentors Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} variant="dark" />
            ))}
          </div>
        )}

        {/* Browse All Link */}
        <div className="text-center">
          <Link
            to="/mentors"
            className="inline-flex items-center gap-2 text-[#6b8073] hover:text-white font-medium transition-colors"
          >
            Browse all mentors
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
