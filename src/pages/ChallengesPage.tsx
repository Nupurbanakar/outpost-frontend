import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { challengesApi, Challenge, ChallengesFilters } from '@/api/endpoints/challenges';
import { OpportunityCard } from '@/components/OpportunityCard';
import { SearchBar } from '@/components/grants/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { ChallengesFiltersPanel } from '@/components/challenges/ChallengesFilters';
import { ChallengesLoadingSkeleton } from '@/components/challenges/ChallengesLoadingSkeleton';
import { parseApiError } from '@/utils/errorHandling';

export default function ChallengesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Parse filters from URL
  const currentPage = parseInt(searchParams.get('page') || '1');
  const keyword = searchParams.get('q') || '';
  const sectorId = searchParams.get('sectorId') || undefined;
  const theme = searchParams.get('theme') || undefined;
  const corporate = searchParams.get('corporate') || undefined;
  const status = searchParams.get('status') as 'OPEN' | 'CLOSED' | undefined;
  const aiEnabled = searchParams.get('ai') === 'true';

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const filters: ChallengesFilters = {
          page: currentPage - 1,
          size: 12,
          q: keyword || undefined,
          sectorId,
          theme,
          corporate,
          status,
          ai: aiEnabled || undefined,
        };

        const response = await challengesApi.getChallenges(filters);
        setChallenges(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (err: any) {
        console.error('Failed to load challenges:', err);
        setError(parseApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenges();
  }, [currentPage, keyword, sectorId, theme, corporate, status, aiEnabled]);

  const handleSearch = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleFilterChange = (key: string, value: string | boolean | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount = [sectorId, theme, corporate, status].filter(Boolean).length;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <PageHeader
          title="Corporate Challenges"
          description="Collaborate with leading corporates on innovation challenges"
        />

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={keyword}
            onChange={handleSearch}
            placeholder="Search challenges by keyword..."
          />
        </div>

        {/* Filters and Results */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <ChallengesFiltersPanel
              selectedSectorId={sectorId}
              selectedTheme={theme}
              selectedCorporate={corporate}
              selectedStatus={status}
              aiEnabled={aiEnabled}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            {!isLoading && !error && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-text">
                  <span className="font-semibold text-ink">{totalElements}</span> challenge
                  {totalElements !== 1 ? 's' : ''} found
                </p>
                {aiEnabled && (
                  <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200">
                    AI-Ranked Results
                  </span>
                )}
              </div>
            )}

            {/* Loading State */}
            {isLoading && <ChallengesLoadingSkeleton />}

            {/* Error State */}
            {error && (
              <EmptyState
                title="Failed to Load Challenges"
                description={error}
                action={{
                  label: 'Try Again',
                  onClick: () => window.location.reload(),
                }}
              />
            )}

            {/* Empty State */}
            {!isLoading && !error && challenges.length === 0 && (
              <EmptyState
                title="No Challenges Found"
                description={
                  activeFiltersCount > 0 || keyword
                    ? 'Try adjusting your filters or search terms.'
                    : 'No challenges are currently available. Check back soon!'
                }
                action={
                  activeFiltersCount > 0 || keyword
                    ? {
                        label: 'Clear Filters',
                        onClick: handleClearFilters,
                      }
                    : undefined
                }
              />
            )}

            {/* Results Grid */}
            {!isLoading && !error && challenges.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {challenges.map((challenge) => (
                    <OpportunityCard
                      key={challenge.id}
                      type="CHALLENGE"
                      id={challenge.id}
                      title={challenge.title}
                      organization={challenge.corporateName}
                      logo={challenge.corporateLogo}
                      sector={challenge.sector?.name}
                      deadline={challenge.deadline}
                      status={challenge.status}
                      aiReason={aiEnabled ? challenge.aiReason : undefined}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
