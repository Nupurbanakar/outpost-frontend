import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { OpportunityCard } from '@/components/OpportunityCard';
import { useStages, useSectors } from '@/hooks';
import { grantsApi, GrantsFilters } from '@/api/endpoints/grants';
import { Search, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Grant } from '@/api/endpoints/grants';
import { useAuth } from '@/contexts';

export default function GrantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [grants, setGrants] = useState<Grant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const { stages } = useStages();
  const { sectors } = useSectors();

  // Get filters from URL
  const issuingBodyType = searchParams.get('issuingBodyType') || '';
  const type = searchParams.get('type') || '';
  const stageId = searchParams.get('stageId') || '';
  const sectorId = searchParams.get('sectorId') || '';
  const amountBand = searchParams.get('amountBand') || '';
  const deadline = searchParams.get('deadline') || '';
  const query = searchParams.get('q') || '';
  const aiEnabled = searchParams.get('ai') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '0');

  // Check if user can use AI (onboarded)
  const canUseAI = user && user.startupName && user.stage && user.sector;

  useEffect(() => {
    fetchGrants();
  }, [searchParams]);

  const fetchGrants = async () => {
    try {
      setIsLoading(true);
      
      const filters: GrantsFilters = {
        page: currentPage,
        size: 12,
      };

      if (issuingBodyType) filters.issuingBodyType = issuingBodyType as any;
      if (type) filters.type = type as any;
      if (stageId) filters.stageId = stageId;
      if (sectorId) filters.sectorId = sectorId;
      if (amountBand) filters.amountBand = amountBand as any;
      if (deadline) filters.deadline = deadline as any;
      if (query) filters.q = query;
      if (aiEnabled && canUseAI) filters.ai = true;

      const response = await grantsApi.getGrants(filters);
      setGrants(response.content);
      setTotalPages(response.page.totalPages);
      setTotalElements(response.page.totalElements);
    } catch (error) {
      console.error('Failed to fetch grants:', error);
      setGrants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to first page
    setSearchParams(newParams);
  };

  const updatePage = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAI = () => {
    const newParams = new URLSearchParams(searchParams);
    if (aiEnabled) {
      newParams.delete('ai');
    } else {
      newParams.set('ai', 'true');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-ink mb-2">
            Grants & Schemes
          </h1>
          <p className="text-muted-text">
            Explore funding opportunities from central and state governments
          </p>
        </div>

        {/* Search & AI Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
            <input
              type="text"
              placeholder="Search grants..."
              value={query}
              onChange={(e) => updateFilter('q', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-line focus:border-[#b58c4f] focus:ring-2 focus:ring-[rgba(214,155,66,0.12)] focus:outline-none bg-paper-light text-ink"
            />
          </div>

          {/* AI Toggle */}
          {canUseAI && (
            <button
              onClick={toggleAI}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                aiEnabled
                  ? 'bg-[#f0f9f4] text-[#2d6a4f] border-2 border-[#2d6a4f]'
                  : 'bg-paper-light text-muted-text border-2 border-line hover:border-ink'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>AI recommendations</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 p-6 bg-paper-light border border-line">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Issuing Body Type */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Issuing Body
              </label>
              <select
                value={issuingBodyType}
                onChange={(e) => updateFilter('issuingBodyType', e.target.value)}
                className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
              >
                <option value="">All</option>
                <option value="CENTRAL">Central Government</option>
                <option value="STATE">State Government</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
              >
                <option value="">All</option>
                <option value="GRANT">Grant</option>
                <option value="SUBSIDY">Subsidy</option>
                <option value="SCHEME">Scheme</option>
                <option value="INCENTIVE">Incentive</option>
              </select>
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Stage
              </label>
              <select
                value={stageId}
                onChange={(e) => updateFilter('stageId', e.target.value)}
                className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
              >
                <option value="">All stages</option>
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sector */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Sector
              </label>
              <select
                value={sectorId}
                onChange={(e) => updateFilter('sectorId', e.target.value)}
                className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
              >
                <option value="">All sectors</option>
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Band */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Amount
              </label>
              <select
                value={amountBand}
                onChange={(e) => updateFilter('amountBand', e.target.value)}
                className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
              >
                <option value="">Any amount</option>
                <option value="UNDER_10L">Under ₹10L</option>
                <option value="10L_50L">₹10L - ₹50L</option>
                <option value="50L_1CR">₹50L - ₹1Cr</option>
                <option value="OVER_1CR">Over ₹1Cr</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Deadline
              </label>
              <select
                value={deadline}
                onChange={(e) => updateFilter('deadline', e.target.value)}
                className="w-full px-3 py-2 border border-line focus:border-[#b58c4f] focus:outline-none bg-paper text-ink"
              >
                <option value="">All</option>
                <option value="OPEN_NOW">Open now</option>
                <option value="CLOSING_THIS_MONTH">Closing this month</option>
                <option value="ROLLING">Rolling</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(issuingBodyType || type || stageId || sectorId || amountBand || deadline || query || aiEnabled) && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="text-sm text-muted-text hover:text-ink underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-text">
            Showing {grants.length} of {totalElements} grants
          </p>
          {aiEnabled && (
            <p className="text-sm text-[#2d6a4f] flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>AI-ranked for your startup</span>
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-paper-light border border-line p-6 h-96 animate-pulse" />
            ))}
          </div>
        ) : grants.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <p className="text-lg text-muted-text mb-4">No grants found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="text-[#b58c4f] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Grants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {grants.map((grant) => (
                <OpportunityCard
                  key={grant.id}
                  opportunity={grant}
                  type="GRANT"
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => updatePage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 border border-line hover:bg-[#f5f3ed] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (currentPage < 3) {
                      pageNum = i;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => updatePage(pageNum)}
                        className={`px-4 py-2 border transition-colors ${
                          currentPage === pageNum
                            ? 'bg-ink text-paper-light border-ink'
                            : 'bg-paper-light text-ink border-line hover:bg-[#f5f3ed]'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => updatePage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="p-2 border border-line hover:bg-[#f5f3ed] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
