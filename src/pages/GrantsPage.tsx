import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { ResultsHeader } from '@/components/common/ResultsHeader';
import { OpportunityCard } from '@/components/OpportunityCard';
import { SearchBar } from '@/components/grants/SearchBar';
import { GrantsFilters } from '@/components/grants/GrantsFilters';
import { GrantsLoadingSkeleton } from '@/components/grants/GrantsLoadingSkeleton';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { useStages, useSectors } from '@/hooks';
import { useAuth } from '@/contexts';
import { grantsApi, Grant } from '@/api/endpoints/grants';
import {
  buildGrantsFilters,
  hasActiveFilters,
  updateFilterParam,
  updatePageParam,
  toggleAIParam,
} from '@/utils/grants/filtersHelpers';

export default function GrantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [grants, setGrants] = useState<Grant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const { stages } = useStages();
  const { sectors } = useSectors();

  // Extract filter values from URL
  const currentPage = parseInt(searchParams.get('page') || '0');
  const query = searchParams.get('q') || '';
  const aiEnabled = searchParams.get('ai') === 'true';
  const issuingBodyType = searchParams.get('issuingBodyType') || '';
  const type = searchParams.get('type') || '';
  const stageId = searchParams.get('stageId') || '';
  const sectorId = searchParams.get('sectorId') || '';
  const amountBand = searchParams.get('amountBand') || '';
  const deadline = searchParams.get('deadline') || '';

  // Check if user can use AI (onboarded)
  const canUseAI = Boolean(user?.startupName && user?.stage && user?.sector);
  const hasFilters = hasActiveFilters(searchParams);

  useEffect(() => {
    fetchGrants();
  }, [searchParams]);

  const fetchGrants = async () => {
    try {
      setIsLoading(true);
      const filters = buildGrantsFilters(searchParams, currentPage);
      
      // Only add AI if user can use it
      if (aiEnabled && !canUseAI) {
        filters.ai = false;
      }

      const response = await grantsApi.getGrants(filters);
      setGrants(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Failed to fetch grants:', error);
      setGrants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams(updateFilterParam(searchParams, key, value));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(updatePageParam(searchParams, page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAI = () => {
    setSearchParams(toggleAIParam(searchParams));
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <PageHeader
          title="Grants & Schemes"
          description="Explore funding opportunities from central and state governments"
        />

        {/* Search & AI Toggle */}
        <SearchBar
          query={query}
          onQueryChange={(value) => handleFilterChange('q', value)}
          aiEnabled={aiEnabled}
          canUseAI={canUseAI}
          onToggleAI={handleToggleAI}
          placeholder="Search grants..."
        />

        {/* Filters */}
        <GrantsFilters
          issuingBodyType={issuingBodyType}
          type={type}
          stageId={stageId}
          sectorId={sectorId}
          amountBand={amountBand}
          deadline={deadline}
          stages={stages}
          sectors={sectors}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasFilters}
        />

        {/* Results Count & AI Badge */}
        {!isLoading && grants.length > 0 && (
          <ResultsHeader
            count={grants.length}
            total={totalElements}
            itemName="grant"
            aiEnabled={aiEnabled && canUseAI}
            aiMessage="AI-ranked for your startup"
          />
        )}

        {/* Content */}
        {isLoading ? (
          <GrantsLoadingSkeleton count={6} />
        ) : grants.length === 0 ? (
          <EmptyState
            title="No grants found matching your criteria"
            actionLabel="Clear filters"
            onAction={handleClearFilters}
          />
        ) : (
          <>
            {/* Grants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {grants.map((grant) => (
                <OpportunityCard
                  key={grant.id}
                  type="GRANT"
                  id={grant.id}
                  title={grant.title}
                  organization={grant.issuingBody}
                  description={grant.summary}
                  deadline={grant.deadline}
                  status={grant.status}
                  aiReason={grant.aiReason}
                />
              ))}
            </div>

            {/* Pagination - only show if more than 1 page */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
