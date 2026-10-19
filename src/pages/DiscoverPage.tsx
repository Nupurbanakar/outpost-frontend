import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { grantsApi } from '@/api/endpoints/grants';
import { mentorsApi } from '@/api/endpoints/mentors';
import { Sparkles, TrendingUp, Users, Clock } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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

        {/* TODO: Opportunities Section (FE-017) */}
        {/* TODO: Mentors Section (FE-018) */}
      </div>
    </AppLayout>
  );
}
