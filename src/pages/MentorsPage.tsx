import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { mentorsApi, Mentor, MentorsFilters } from '@/api/endpoints/mentors';
import { MentorCard } from '@/components/MentorCard';
import { SearchBar } from '@/components/grants/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { MentorsFiltersPanel } from '@/components/mentors/MentorsFilters';
import { MentorsLoadingSkeleton } from '@/components/mentors/MentorsLoadingSkeleton';
import { parseApiError } from '@/utils/errorHandling';
import { UserPlus } from 'lucide-react';

export default function MentorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Parse filters from URL
  const currentPage = parseInt(searchParams.get('page') || '1');
  const keyword = searchParams.get('q') || '';
  const stageId = searchParams.get('stageId') || undefined;
  const sectorId = searchParams.get('sectorId') || undefined;
  const expertise = searchParams.getAll('expertise');
  const aiEnabled = searchParams.get('ai') === 'true';

  useEffect(() => {
    const loadMentors = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const filters: MentorsFilters = {
          page: currentPage - 1,
          size: 12,
          q: keyword || undefined,
          stageId,
          sectorId,
          expertise: expertise.length > 0 ? expertise : undefined,
          ai: aiEnabled || undefined,
        };

        console.log('🔍 Mentors filters being sent:', filters);
        console.log('📋 URL params:', {
          page: currentPage,
          keyword,
          stageId,
          sectorId,
          expertise,
          aiEnabled,
        });

        const response = await mentorsApi.getMentors(filters);
        console.log('✅ Mentors response:', response);
        
        setMentors(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (err: any) {
        console.error('❌ Failed to load mentors:', err);
        setError(parseApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadMentors();
  }, [currentPage, keyword, stageId, sectorId, expertise.join(','), aiEnabled]);

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

  const handleFilterChange = (key: string, value: string | string[] | boolean | null) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (key === 'expertise') {
      // Clear existing expertise params
      newParams.delete('expertise');
      // Add new ones
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => newParams.append('expertise', v));
      }
    } else {
      if (value === null || value === '' || value === false) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
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

  const activeFiltersCount = [stageId, sectorId, ...expertise].filter(Boolean).length;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-3">
              Find a Mentor
            </h1>
            <p className="text-lg text-muted-text">
              Connect with experienced founders and operators
            </p>
          </div>
          
          {/* Become a Mentor Button */}
          <Link
            to="/mentors/apply"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-ink text-paper-light font-semibold hover:bg-[#304258] transition-colors rounded-lg whitespace-nowrap"
          >
            <UserPlus className="w-5 h-5" />
            Become a Mentor
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={keyword}
            onChange={handleSearch}
            placeholder="Search mentors by name or expertise..."
          />
        </div>

        {/* Filters and Results */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <MentorsFiltersPanel
              selectedStageId={stageId}
              selectedSectorId={sectorId}
              selectedExpertise={expertise}
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
                  <span className="font-semibold text-ink">{totalElements}</span> mentor
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
            {isLoading && <MentorsLoadingSkeleton />}

            {/* Error State */}
            {error && (
              <EmptyState
                title="Failed to Load Mentors"
                description={error}
                action={{
                  label: 'Try Again',
                  onClick: () => window.location.reload(),
                }}
              />
            )}

            {/* Empty State */}
            {!isLoading && !error && mentors.length === 0 && (
              <EmptyState
                title="No Mentors Found"
                description={
                  activeFiltersCount > 0 || keyword
                    ? 'Try adjusting your filters or search terms.'
                    : 'No mentors are currently available. Check back soon!'
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
            {!isLoading && !error && mentors.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {mentors.map((mentor) => (
                    <MentorCard
                      key={mentor.id}
                      mentor={mentor}
                      variant="light"
                      showAiReason={aiEnabled}
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
