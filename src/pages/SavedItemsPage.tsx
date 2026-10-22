import { useState, useEffect } from 'react';
import { Bookmark, Calendar, Building2, Trash2, ExternalLink, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { EmptyState } from '../components/common/EmptyState';
import { getBookmarks, BookmarkedItem, removeBookmark } from '../utils/bookmarks';
import { formatDate } from '@/utils/dateUtils';
import api from '../api/client';

interface Grant {
  id: string;
  title: string;
  issuingBody: string;
  summary: string;
  deadline?: string;
  status: string;
  amountMin?: number;
  amountMax?: number;
}

interface Challenge {
  id: string;
  title: string;
  corporateName: string;
  sector?: { id: string; name: string };
  deadline?: string;
  status: string;
  theme?: string;
}

type SavedItem = (Grant | Challenge) & { 
  type: 'GRANT' | 'CHALLENGE';
  bookmarkedAt: number;
};

export default function SavedItemsPage() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookmarkedItems();
  }, []);

  const loadBookmarkedItems = async () => {
    setIsLoading(true);
    const bookmarks = getBookmarks();

    try {
      // Fetch all items
      const itemPromises = bookmarks.map(async (bookmark) => {
        try {
          const endpoint = bookmark.type === 'grant' ? '/grants' : '/challenges';
          const response = await api.get(`${endpoint}/${bookmark.id}`);
          return {
            ...response.data,
            type: bookmark.type === 'grant' ? 'GRANT' as const : 'CHALLENGE' as const,
            bookmarkedAt: bookmark.timestamp,
          };
        } catch (error) {
          console.error(`Failed to load ${bookmark.type} ${bookmark.id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(itemPromises);
      const validItems = results.filter((item): item is SavedItem => item !== null);
      
      // Sort by most recently bookmarked
      validItems.sort((a, b) => b.bookmarkedAt - a.bookmarkedAt);
      
      setSavedItems(validItems);
    } catch (error) {
      console.error('Failed to load bookmarked items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = (id: string) => {
    removeBookmark(id);
    setSavedItems(items => items.filter(item => item.id !== id));
  };

  const isGrant = (item: SavedItem): item is SavedItem & Grant => {
    return item.type === 'GRANT';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'PUBLISHED': 'bg-green-100 text-green-800 border-green-200',
      'OPEN': 'bg-green-100 text-green-800 border-green-200',
      'EXPIRED': 'bg-gray-100 text-gray-600 border-gray-200',
      'CLOSED': 'bg-gray-100 text-gray-600 border-gray-200',
      'DRAFT': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    );
  };

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
            {savedItems.length > 0 
              ? `${savedItems.length} ${savedItems.length === 1 ? 'item' : 'items'} saved`
              : 'Your bookmarked grants and challenges'}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12 text-muted-text">
            Loading saved items...
          </div>
        )}

        {/* Empty State */}
        {!isLoading && savedItems.length === 0 && (
          <EmptyState
            title="No saved items yet"
            description="Bookmark grants and challenges to view them here"
          />
        )}

        {/* Saved Items List */}
        {!isLoading && savedItems.length > 0 && (
          <div className="bg-paper-light border border-line overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-[#f5f3ed]">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Opportunity
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Organization
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Deadline
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-ink uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-paper-light divide-y divide-line">
                  {savedItems.map((item) => {
                    const itemIsGrant = isGrant(item);
                    const link = itemIsGrant ? `/grants/${item.id}` : `/challenges/${item.id}`;
                    
                    return (
                      <tr key={item.id} className="hover:bg-[#f5f3ed] transition-colors">
                        {/* Type Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold uppercase tracking-wide border ${
                            itemIsGrant
                              ? 'bg-[#f0f9f4] text-[#2d6a4f] border-[#95d5b2]'
                              : 'bg-[#fef3e2] text-[#b58c4f] border-[#f4d8a8]'
                          }`}>
                            {itemIsGrant ? 'Grant' : 'Challenge'}
                          </span>
                        </td>

                        {/* Title */}
                        <td className="px-6 py-4">
                          <Link 
                            to={link}
                            className="text-sm font-semibold text-ink hover:text-[#b58c4f] line-clamp-2 max-w-xs"
                          >
                            {item.title}
                          </Link>
                        </td>

                        {/* Organization */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted-text flex-shrink-0" />
                            <span className="text-sm text-muted-text">
                              {itemIsGrant ? item.issuingBody : (item as Challenge).corporateName}
                            </span>
                          </div>
                        </td>

                        {/* Details (Amount for grants, Sector/Theme for challenges) */}
                        <td className="px-6 py-4">
                          {itemIsGrant ? (
                            <div className="flex items-center gap-1.5 text-sm text-ink">
                              <IndianRupee className="w-4 h-4 text-[#b58c4f]" />
                              <span>
                                {item.amountMin || item.amountMax
                                  ? `${item.amountMin ? '₹' + (item.amountMin / 100000).toFixed(0) + 'L' : ''} ${item.amountMin && item.amountMax ? '-' : ''} ${item.amountMax ? '₹' + (item.amountMax / 100000).toFixed(0) + 'L' : ''}`
                                  : 'See details'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-text">
                              {(item as Challenge).sector?.name || (item as Challenge).theme || '—'}
                            </span>
                          )}
                        </td>

                        {/* Deadline */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-muted-text">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {item.deadline ? formatDate(item.deadline) : 'Rolling'}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={link}
                              className="p-2 text-ink hover:bg-[#f5f3ed] rounded transition-colors"
                              title="View details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleRemoveBookmark(item.id)}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Remove bookmark"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
