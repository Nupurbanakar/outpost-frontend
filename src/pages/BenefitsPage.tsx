import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Gift, Sparkles } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { BenefitCard } from '../components/benefits/BenefitCard';
import { BenefitsFilters } from '../components/benefits/BenefitsFilters';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../contexts';
import {
  getBenefits,
  getFeaturedBenefits,
  getBenefitCategories,
  getBenefitPartners,
  Benefit,
} from '../api/endpoints/benefits';

export default function BenefitsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [featuredBenefits, setFeaturedBenefits] = useState<Benefit[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [partners, setPartners] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Extract filter values from URL
  const currentPage = parseInt(searchParams.get('page') || '0');
  const category = searchParams.get('category') || '';
  const partner = searchParams.get('partner') || '';
  const query = searchParams.get('q') || '';
  const includeExpired = searchParams.get('includeExpired') === 'true';
  const aiEnabled = searchParams.get('ai') === 'true';

  const canUseAI = Boolean(user?.startupName && user?.stage && user?.sector);
  const hasFilters = Boolean(category || partner || query || includeExpired);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchBenefits();
  }, [searchParams]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, partnersData, featuredData] = await Promise.all([
        getBenefitCategories(),
        getBenefitPartners(),
        getFeaturedBenefits(),
      ]);
      setCategories(categoriesData);
      setPartners(partnersData);
      setFeaturedBenefits(featuredData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const fetchBenefits = async () => {
    try {
      setIsLoading(true);
      const filters = {
        category: category || undefined,
        partner: partner || undefined,
        q: query || undefined,
        includeExpired,
        ai: aiEnabled && canUseAI,
        page: currentPage,
        size: 20,
      };

      const response = await getBenefits(filters);
      setBenefits(response.content);
      setTotalPages(response.page.totalPages);
      setTotalElements(response.page.totalElements);
    } catch (error) {
      console.error('Failed to fetch benefits:', error);
      setBenefits([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to first page
    setSearchParams(newParams);
  };

  const handleToggleExpired = () => {
    const newParams = new URLSearchParams(searchParams);
    if (includeExpired) {
      newParams.delete('includeExpired');
    } else {
      newParams.set('includeExpired', 'true');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleToggleAI = () => {
    const newParams = new URLSearchParams(searchParams);
    if (aiEnabled) {
      newParams.delete('ai');
    } else {
      newParams.set('ai', 'true');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-serif font-bold text-gray-900">Benefits & Perks</h1>
          </div>
          <p className="text-gray-600">Exclusive offers from our partner ecosystem</p>
        </header>

        {/* Featured Benefits */}
        {featuredBenefits.length > 0 && !hasFilters && (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">Featured Partners</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredBenefits.map((benefit) => (
                <BenefitCard key={benefit.id} benefit={benefit} />
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <BenefitsFilters
          category={category}
          partner={partner}
          query={query}
          includeExpired={includeExpired}
          aiEnabled={aiEnabled}
          canUseAI={canUseAI}
          categories={categories}
          partners={partners}
          onFilterChange={handleFilterChange}
          onToggleExpired={handleToggleExpired}
          onToggleAI={handleToggleAI}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasFilters}
        />

        {/* Results Count & AI Badge */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {isLoading ? 'Loading...' : `${totalElements} ${totalElements === 1 ? 'benefit' : 'benefits'}`}
          </p>
          {aiEnabled && canUseAI && (
            <div className="flex items-center gap-2 text-sm text-indigo-600">
              <Sparkles className="h-4 w-4" />
              <span>AI-ranked for you</span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-100"></div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && benefits.length === 0 && (
          <EmptyState
            title="No benefits found"
            description="Try adjusting your filters or check back later for new offers"
            actionLabel={hasFilters ? 'Clear filters' : undefined}
            onAction={hasFilters ? handleClearFilters : undefined}
          />
        )}

        {/* Benefits Grid */}
        {!isLoading && benefits.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {benefits.map((benefit) => (
                <BenefitCard key={benefit.id} benefit={benefit} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
