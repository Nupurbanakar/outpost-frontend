import { useState, useCallback } from 'react';
import { toggleBookmark, isBookmarked } from '../utils/bookmarks';

/**
 * Hook for managing bookmark state with optimistic updates
 * @param id - Item ID
 * @param type - Item type (grant or challenge)
 * @returns Bookmark state and toggle function
 */
export function useBookmark(id: string, type: 'grant' | 'challenge') {
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(id));
  const [isUpdating, setIsUpdating] = useState(false);

  const toggle = useCallback(async () => {
    // Optimistic update
    const newState = !bookmarked;
    setBookmarked(newState);
    setIsUpdating(true);

    try {
      // Update localStorage
      const actualState = toggleBookmark(id, type);
      
      // Rollback if localStorage update failed
      if (actualState !== newState) {
        setBookmarked(actualState);
      }
    } catch (error) {
      // Rollback on error
      console.error('Bookmark toggle failed:', error);
      setBookmarked(!newState);
    } finally {
      setIsUpdating(false);
    }
  }, [id, type, bookmarked]);

  return {
    bookmarked,
    isUpdating,
    toggle,
  };
}
