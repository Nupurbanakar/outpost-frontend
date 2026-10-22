import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Sparkles } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { CandidateCard } from '../components/talent/CandidateCard';
import { TalentFilters } from '../components/talent/TalentFilters';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../contexts';
import {
  getCandidates,
  getCandidateRoles,
  getCandidateSkills,
  Candidate,
} from '../api/endpoints/candidates';

export default function TalentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Extract filter values from URL
  const currentPage = parseInt(searchParams.get('page') || '0');
  const role = searchParams.get('role') || '';
  const experienceLevel = searchParams.get('experienceLevel') || '';
  const location = searchParams.get('location') || '';
  const availability = searchParams.get('availability') || '';
  const query = searchParams.get('q') || '';
  const aiEnabled = searchParams.get('ai') === 'true';
  const selectedSkills = searchParams.get('skills')?.split(',').filter(Boolean) || [];

  const canUseAI = Boolean(user?.startupName && user?.stage && user?.sector);
  const hasFilters = Boolean(
    role || experienceLevel || location || availability || query || selectedSkills.length > 0
  );

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [searchParams]);

  const loadInitialData = async () => {
    try {
      const [rolesData, skillsData] = await Promise.all([
        getCandidateRoles(),
        getCandidateSkills(),
      ]);
      setRoles(rolesData);
      setSkills(skillsData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const filters = {
        role: role || undefined,
        experienceLevel: experienceLevel || undefined,
        location: location || undefined,
        availability: availability || undefined,
        q: query || undefined,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        ai: aiEnabled && canUseAI,
        page: currentPage,
        size: 20,
      };

      const response = await getCandidates(filters);
      setCandidates(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      setCandidates([]);
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

  const handleSkillsChange = (newSkills: string[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (newSkills.length > 0) {
      newParams.set('skills', newSkills.join(','));
    } else {
      newParams.delete('skills');
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
            <Users className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-serif font-bold text-gray-900">Talent Pool</h1>
          </div>
          <p className="text-gray-600">Browse T-Hub's vetted talent for your startup</p>
        </header>

        {/* Filters */}
        <TalentFilters
          role={role}
          selectedSkills={selectedSkills}
          experienceLevel={experienceLevel}
          location={location}
          availability={availability}
          query={query}
          aiEnabled={aiEnabled}
          canUseAI={canUseAI}
          roles={roles}
          skills={skills}
          onFilterChange={handleFilterChange}
          onSkillsChange={handleSkillsChange}
          onToggleAI={handleToggleAI}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasFilters}
        />

        {/* Results Count & AI Badge */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {isLoading ? 'Loading...' : `${totalElements} ${totalElements === 1 ? 'candidate' : 'candidates'}`}
          </p>
          {aiEnabled && canUseAI && (
            <div className="flex items-center gap-2 text-sm text-indigo-600">
              <Sparkles className="h-4 w-4" />
              <span>AI-matched for your startup</span>
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
        {!isLoading && candidates.length === 0 && (
          <EmptyState
            title="No candidates found"
            description="Try adjusting your filters or check back later for new talent"
            actionLabel={hasFilters ? 'Clear filters' : undefined}
            onAction={hasFilters ? handleClearFilters : undefined}
          />
        )}

        {/* Candidates Grid */}
        {!isLoading && candidates.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
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
