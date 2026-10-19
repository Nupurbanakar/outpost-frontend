import { useState, useEffect } from 'react';
import { lookupsApi } from '@/api';
import type { Sector } from '@/types';

interface UseSectorsResult {
  sectors: Sector[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * useSectors - Fetches startup sectors from backend
 * 
 * Features:
 * - Auto-fetches on mount
 * - Caches data (doesn't refetch unnecessarily)
 * - Provides loading and error states
 * - Manual refetch capability
 */
export function useSectors(): UseSectorsResult {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSectors = async () => {
    // If already have data, don't refetch unless explicitly called
    if (sectors.length > 0 && !isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await lookupsApi.getSectors();
      setSectors(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch sectors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    setSectors([]); // Clear cache
    await fetchSectors();
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  return { sectors, isLoading, error, refetch };
}
