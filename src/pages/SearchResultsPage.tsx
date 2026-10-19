import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, TrendingUp, Award, Users } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { OpportunityCard } from '../components/OpportunityCard';
import { MentorCard } from '../components/MentorCard';
import { EmptyState } from '../components/common/EmptyState';
import api from '../api/client';

interface Grant {
  id: string;
  name: string;
  issuingBody: string;
  type: string;
  amountDisplay: string;
  deadline: string;
  summary: string;
  stages: string[];
  sectors: string[];
  expired: boolean;
}

interface Challenge {
  id: string;
  title: string;
  corporateName: string;
  corporateLogoUrl?: string;
  sector: string;
  theme: string;
  deadline: string;
  status: string;
  hasDetail: boolean;
}

interface Mentor {
  id: string;
  name: string;
  photoUrl?: string;
  headline: string;
  expertise: string[];
  bio?: string;
  calComUrl?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

type TabType = 'all' | 'grants' | 'challenges' | 'mentors';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [grants, setGrants] = useState<Grant[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const [grantsRes, challengesRes, mentorsRes] = await Promise.allSettled([
          api.get('/grants', { params: { q: query, size: 20 } }),
          api.get('/challenges', { params: { q: query, size: 20 } }),
          api.get('/mentors', { params: { q: query, size: 20 } }),
        ]);

        if (grantsRes.status === 'fulfilled') {
          setGrants(grantsRes.value.data.content || []);
        }
        if (challengesRes.status === 'fulfilled') {
          setChallenges(challengesRes.value.data.content || []);
        }
        if (mentorsRes.status === 'fulfilled') {
          setMentors(mentorsRes.value.data.content || []);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const totalResults = grants.length + challenges.length + mentors.length;

  const tabs = [
    { id: 'all' as const, label: 'All', count: totalResults },
    { id: 'grants' as const, label: 'Grants', count: grants.length },
    { id: 'challenges' as const, label: 'Challenges', count: challenges.length },
    { id: 'mentors' as const, label: 'Mentors', count: mentors.length },
  ];

  const showGrants = activeTab === 'all' || activeTab === 'grants';
  const showChallenges = activeTab === 'all' || activeTab === 'challenges';
  const showMentors = activeTab === 'all' || activeTab === 'mentors';

  if (!query) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <EmptyState
            title="No search query"
            description="Enter a search term to find grants, challenges, and mentors"
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Search className="h-4 w-4" />
            <span>Search results for</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">"{query}"</h1>
          {!isLoading && (
            <p className="mt-2 text-sm text-gray-600">
              {totalResults} {totalResults === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Searching...</div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && totalResults === 0 && (
          <EmptyState
            title="No results found"
            description={`We couldn't find anything matching "${query}". Try different keywords or browse all content.`}
          />
        )}

        {/* Results */}
        {!isLoading && totalResults > 0 && (
          <div className="space-y-8">
            {/* Grants Section */}
            {showGrants && grants.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Grants
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        ({grants.length})
                      </span>
                    </h2>
                  </div>
                  {activeTab === 'all' && grants.length > 3 && (
                    <Link
                      to={`/grants?q=${encodeURIComponent(query)}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      View all grants →
                    </Link>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(activeTab === 'all' ? grants.slice(0, 3) : grants).map((grant) => (
                    <OpportunityCard
                      key={grant.id}
                      id={grant.id}
                      title={grant.name}
                      organization={grant.issuingBody}
                      type="GRANT"
                      amount={grant.amountDisplay}
                      deadline={grant.deadline}
                      status={grant.expired ? 'EXPIRED' : undefined}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Challenges Section */}
            {showChallenges && challenges.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Challenges
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        ({challenges.length})
                      </span>
                    </h2>
                  </div>
                  {activeTab === 'all' && challenges.length > 3 && (
                    <Link
                      to={`/challenges?q=${encodeURIComponent(query)}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      View all challenges →
                    </Link>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(activeTab === 'all' ? challenges.slice(0, 3) : challenges).map((challenge) => (
                    <OpportunityCard
                      key={challenge.id}
                      id={challenge.id}
                      title={challenge.title}
                      organization={challenge.corporateName}
                      type="CHALLENGE"
                      deadline={challenge.deadline}
                      sector={challenge.sector}
                      status={challenge.status}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Mentors Section */}
            {showMentors && mentors.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Mentors
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        ({mentors.length})
                      </span>
                    </h2>
                  </div>
                  {activeTab === 'all' && mentors.length > 3 && (
                    <Link
                      to={`/mentors?q=${encodeURIComponent(query)}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      View all mentors →
                    </Link>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(activeTab === 'all' ? mentors.slice(0, 4) : mentors).map((mentor) => (
                    <MentorCard
                      key={mentor.id}
                      mentor={mentor as any}
                      variant="light"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
