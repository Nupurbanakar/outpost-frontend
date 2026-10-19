import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { OpportunityCard } from '../components/OpportunityCard';
import { EmptyState } from '../components/common/EmptyState';
import { getBookmarks, BookmarkedItem } from '../utils/bookmarks';
import api from '../api/client';

interface Grant {
  id: string;
  title: string;
  issuingBody: string;
  summary: string;
  deadline?: string;
  status: string;
}

interface Challenge {
  id: string;
  title: string;
  corporateName: string;
  sector: string;
  deadline: string;
  status: string;
}

export default function SavedItemsPage() {
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedItem[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookmarkedItems();
  }, []);

  const loadBookmarkedItems = async () => {
    setIsLoading(true);
    const bookmarks = getBookmarks();
    setBookmarkedItems(bookmarks);

    // Fetch full details for each bookmarked item
    const grantIds = bookmarks.filter(b => b.type === 'grant').map(b => b.id);
    const challengeIds = bookmarks.filter(b => b.type === 'challenge').map(b => b.id);

    try {
      const [grantResults, challengeResults] = await Promise.allSettled([
        Promise.all(grantIds.map(id => api.get(`/grants/${id}`).catch(() => null))),
        Promise.all(challengeIds.map(id => api.get(`/challenges/${id}`).catch(() => null)))
      ]);

      if (grantResults.status === 'fulfilled') {
        setGrants(grantResults.value.filter(r => r !== null).map(r => r!.data));
      }
      if (challengeResults.status === 'fulfilled') {
        setChallenges(challengeResults.value.filter(r => r !== null).map(r => r!.data));
      }
    } catch (error) {
      console.error('Failed to load bookmarked items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkRemoved = () => {
    // Reload bookmarks when one is removed
    loadBookmarkedItems();
  };

  const totalSaved = grants.length + challenges.length;

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Bookmark className="h-8 w-8 fill-[#b58c4f] text-[#b58c4f]" />
            <h1 className="text-4xl font-serif font-bold text-ink">Saved Items</h1>
          </div>
          <p className="mt-2 text-muted-text">
            Your bookmarked grants and challenges
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12 text-gray-600">
            Loading saved items...
          </div>
        )}

        {/* Empty State */}
        {!isLoading && totalSaved === 0 && (
          <EmptyState
            title="No saved items yet"
            description="Bookmark grants and challenges to view them here"
          />
        )}

        {/* Saved Items */}
        {!isLoading && totalSaved > 0 && (
          <div className="space-y-8">
            {/* Grants Section */}
            {grants.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-semibold text-ink">
                  Grants
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({grants.length})
                  </span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      onBookmark={handleBookmarkRemoved}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Challenges Section */}
            {challenges.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-semibold text-ink">
                  Challenges
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({challenges.length})
                  </span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {challenges.map((challenge) => (
                    <OpportunityCard
                      key={challenge.id}
                      type="CHALLENGE"
                      id={challenge.id}
                      title={challenge.title}
                      organization={challenge.corporateName}
                      sector={challenge.sector}
                      deadline={challenge.deadline}
                      status={challenge.status}
                      onBookmark={handleBookmarkRemoved}
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
