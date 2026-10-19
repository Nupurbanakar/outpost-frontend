/**
 * Bookmark utilities using localStorage
 * Since backend doesn't support bookmarks, we store them client-side
 */

export interface BookmarkedItem {
  id: string;
  type: 'grant' | 'challenge';
  savedAt: string;
}

const STORAGE_KEY = 'outpost-bookmarks';

/**
 * Get all bookmarked items from localStorage
 */
export function getBookmarks(): BookmarkedItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read bookmarks:', error);
    return [];
  }
}

/**
 * Check if an item is bookmarked
 */
export function isBookmarked(id: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some((item) => item.id === id);
}

/**
 * Add an item to bookmarks
 */
export function addBookmark(id: string, type: 'grant' | 'challenge'): boolean {
  try {
    const bookmarks = getBookmarks();
    
    // Don't add duplicates
    if (bookmarks.some((item) => item.id === id)) {
      return false;
    }

    const newBookmark: BookmarkedItem = {
      id,
      type,
      savedAt: new Date().toISOString(),
    };

    bookmarks.unshift(newBookmark); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return true;
  } catch (error) {
    console.error('Failed to add bookmark:', error);
    return false;
  }
}

/**
 * Remove an item from bookmarks
 */
export function removeBookmark(id: string): boolean {
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter((item) => item.id !== id);
    
    if (filtered.length === bookmarks.length) {
      return false; // Item wasn't bookmarked
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to remove bookmark:', error);
    return false;
  }
}

/**
 * Toggle bookmark status
 */
export function toggleBookmark(id: string, type: 'grant' | 'challenge'): boolean {
  if (isBookmarked(id)) {
    removeBookmark(id);
    return false;
  } else {
    addBookmark(id, type);
    return true;
  }
}

/**
 * Get bookmarks by type
 */
export function getBookmarksByType(type: 'grant' | 'challenge'): BookmarkedItem[] {
  const bookmarks = getBookmarks();
  return bookmarks.filter((item) => item.type === type);
}

/**
 * Clear all bookmarks (useful for testing)
 */
export function clearBookmarks(): void {
  localStorage.removeItem(STORAGE_KEY);
}
