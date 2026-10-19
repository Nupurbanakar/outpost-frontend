import { useState, useEffect } from 'react';
import { lookupsApi } from '@/api';
import type { Stage } from '@/types';

interface UseStagesResult {
  stages: Stage[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * useStages - Fetches startup stages from backend
 * 
 * Features:
 * - Auto-fetches on mount
 * - Caches data (doesn't refetch unnecessarily)
 * - Provides loading and error states
 * - Manual refetch capability
 */
export function useStages(): UseStagesResult {
  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStages = async () => {
    // If already have data, don't refetch unless explicitly called
    if (stages.length > 0 && !isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await lookupsApi.getStages();
      setStages(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch stages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    setStages([]); // Clear cache
    await fetchStages();
  };

  useEffect(() => {
    fetchStages();
  }, []);

  return { stages, isLoading, error, refetch };
}
