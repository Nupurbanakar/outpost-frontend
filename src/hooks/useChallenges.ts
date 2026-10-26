import { useQuery, useQueryClient } from '@tanstack/react-query';
import { challengesApi, Challenge, ChallengesFilters } from '@/api/endpoints/challenges';
import type { PaginatedResponse } from '@/types';

/**
 * Query key factory for challenges
 */
export const challengesKeys = {
  all: ['challenges'] as const,
  lists: () => [...challengesKeys.all, 'list'] as const,
  list: (filters: ChallengesFilters) => [...challengesKeys.lists(), filters] as const,
  details: () => [...challengesKeys.all, 'detail'] as const,
  detail: (id: string) => [...challengesKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated challenges with filters
 * 
 * Automatically caches results and refetches when filters change
 * 
 * @example
 * const { data, isLoading, error } = useChallenges({ 
 *   ai: true, 
 *   status: 'OPEN',
 *   page: 0, 
 *   size: 20 
 * });
 */
export function useChallenges(filters: ChallengesFilters = {}) {
  return useQuery<PaginatedResponse<Challenge>, Error>({
    queryKey: challengesKeys.list(filters),
    queryFn: () => challengesApi.getChallenges(filters),
    // Keep AI-ranked data fresh for 2 minutes (since it's personalized)
    staleTime: filters.ai ? 2 * 60 * 1000 : 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single challenge by ID
 * 
 * @example
 * const { data: challenge, isLoading } = useChallengeById('challenge-123');
 */
export function useChallengeById(id: string) {
  return useQuery<Challenge, Error>({
    queryKey: challengesKeys.detail(id),
    queryFn: () => challengesApi.getChallengeById(id),
    enabled: !!id, // Only fetch if id is provided
  });
}

/**
 * Hook to invalidate all challenges queries
 * 
 * Use this when challenges data changes (e.g., admin edits)
 * 
 * @example
 * const invalidateChallenges = useInvalidateChallenges();
 * invalidateChallenges(); // Refresh all challenges queries
 */
export function useInvalidateChallenges() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({
      queryKey: challengesKeys.all,
    });
    
    console.log('[React Query] Invalidated all challenges queries');
  };
}
