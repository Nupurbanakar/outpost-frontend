import { useQuery, useQueryClient } from '@tanstack/react-query';
import { grantsApi, Grant, GrantsFilters } from '@/api/endpoints/grants';
import type { PaginatedResponse } from '@/types';

/**
 * Query key factory for grants
 */
export const grantsKeys = {
  all: ['grants'] as const,
  lists: () => [...grantsKeys.all, 'list'] as const,
  list: (filters: GrantsFilters) => [...grantsKeys.lists(), filters] as const,
  details: () => [...grantsKeys.all, 'detail'] as const,
  detail: (id: string) => [...grantsKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated grants with filters
 * 
 * Automatically caches results and refetches when filters change
 * 
 * @example
 * const { data, isLoading, error } = useGrants({ 
 *   ai: true, 
 *   page: 0, 
 *   size: 20 
 * });
 */
export function useGrants(filters: GrantsFilters = {}) {
  return useQuery<PaginatedResponse<Grant>, Error>({
    queryKey: grantsKeys.list(filters),
    queryFn: () => grantsApi.getGrants(filters),
    // Keep AI-ranked data fresh for 2 minutes (since it's personalized)
    staleTime: filters.ai ? 2 * 60 * 1000 : 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single grant by ID
 * 
 * @example
 * const { data: grant, isLoading } = useGrantById('grant-123');
 */
export function useGrantById(id: string) {
  return useQuery<Grant, Error>({
    queryKey: grantsKeys.detail(id),
    queryFn: () => grantsApi.getGrantById(id),
    enabled: !!id, // Only fetch if id is provided
  });
}

/**
 * Hook to invalidate AI-ranked queries
 * 
 * Use this when founder profile changes to refresh personalized rankings
 * 
 * @example
 * const invalidateAIRankings = useInvalidateAIRankings();
 * 
 * // After profile update:
 * await updateProfile(data);
 * invalidateAIRankings(); // Refresh all AI-ranked lists
 */
export function useInvalidateAIRankings() {
  const queryClient = useQueryClient();
  
  return () => {
    // Invalidate all queries with ai=true filter
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        
        // Check if this is a list query
        if (queryKey[0] === 'grants' && queryKey[1] === 'list') {
          const filters = queryKey[2] as GrantsFilters | undefined;
          return filters?.ai === true;
        }
        
        if (queryKey[0] === 'challenges' && queryKey[1] === 'list') {
          const filters = queryKey[2] as any;
          return filters?.ai === true;
        }
        
        if (queryKey[0] === 'mentors' && queryKey[1] === 'list') {
          const filters = queryKey[2] as any;
          return filters?.ai === true;
        }
        
        return false;
      },
    });
    
    console.log('[React Query] Invalidated all AI-ranked queries');
  };
}

/**
 * Hook to invalidate all grants queries
 * 
 * Use this when grants data changes (e.g., admin edits)
 * 
 * @example
 * const invalidateGrants = useInvalidateGrants();
 * invalidateGrants(); // Refresh all grants queries
 */
export function useInvalidateGrants() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({
      queryKey: grantsKeys.all,
    });
    
    console.log('[React Query] Invalidated all grants queries');
  };
}
