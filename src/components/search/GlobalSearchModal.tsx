import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { globalSearch, SearchResult } from '../../api/endpoints/search';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recent-searches', []);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Search handler with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchResults = await globalSearch(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      // Add to recent searches
      const newRecent = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
      setRecentSearches(newRecent);

      // Navigate to detail page
      const paths = {
        grant: `/grants/${result.id}`,
        challenge: `/challenges/${result.id}`,
        mentor: `/mentors/${result.id}`,
      };
      navigate(paths[result.type]);
      onClose();
    },
    [query, recentSearches, setRecentSearches, navigate, onClose]
  );

  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[10vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search grants, challenges, mentors..."
            className="flex-1 text-lg outline-none placeholder:text-gray-400"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="rounded p-1 hover:bg-gray-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <kbd className="hidden rounded border border-gray-300 bg-gray-50 px-2 py-1 text-xs text-gray-500 sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Results or Recent Searches */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!query && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(search)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && isLoading && (
            <div className="flex items-center justify-center py-8 text-sm text-gray-500">
              Searching...
            </div>
          )}

          {query && !isLoading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-sm text-gray-500">No results found for "{query}"</div>
              <div className="mt-1 text-xs text-gray-400">
                Try searching for grants, challenges, or mentors
              </div>
            </div>
          )}

          {query && !isLoading && results.length > 0 && (
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-indigo-50 text-indigo-900'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {result.type === 'grant' && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                    )}
                    {result.type === 'challenge' && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                    )}
                    {result.type === 'mentor' && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        <div className="text-sm font-medium">
                          {result.title.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{result.title}</div>
                    <div
                      className={`mt-0.5 text-sm ${
                        index === selectedIndex ? 'text-indigo-700' : 'text-gray-600'
                      }`}
                    >
                      {result.subtitle}
                    </div>
                  </div>
                  <div
                    className={`mt-1 rounded px-2 py-1 text-xs font-medium ${
                      result.type === 'grant'
                        ? 'bg-green-100 text-green-700'
                        : result.type === 'challenge'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {result.type}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-2">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5">↑</kbd>
              <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5">↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5">↵</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5">ESC</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
