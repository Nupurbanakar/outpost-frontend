import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mentorsApi, Mentor, MentorsFilters } from '@/api/endpoints/mentors';
import type { PaginatedResponse } from '@/types';

/**
 * Query key factory for mentors
 */
export const mentorsKeys = {
  all: ['mentors'] as const,
  lists: () => [...mentorsKeys.all, 'list'] as const,
  list: (filters: MentorsFilters) => [...mentorsKeys.lists(), filters] as const,
  details: () => [...mentorsKeys.all, 'detail'] as const,
  detail: (id: string) => [...mentorsKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated mentors with filters
 * 
 * Automatically caches results and refetches when filters change
 * 
 * @example
 * const { data, isLoading, error } = useMentors({ 
 *   ai: true, 
 *   expertise: ['Product', 'Engineering'],
 *   page: 0, 
 *   size: 20 
 * });
 */
export function useMentors(filters: MentorsFilters = {}) {
  return useQuery<PaginatedResponse<Mentor>, Error>({
    queryKey: mentorsKeys.list(filters),
    queryFn: () => mentorsApi.getMentors(filters),
    // Keep AI-ranked data fresh for 2 minutes (since it's personalized)
    staleTime: filters.ai ? 2 * 60 * 1000 : 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single mentor by ID
 * 
 * @example
 * const { data: mentor, isLoading } = useMentorById('mentor-123');
 */
export function useMentorById(id: string) {
  return useQuery<Mentor, Error>({
    queryKey: mentorsKeys.detail(id),
    queryFn: () => mentorsApi.getMentorById(id),
    enabled: !!id, // Only fetch if id is provided
  });
}

/**
 * Hook to invalidate all mentors queries
 * 
 * Use this when mentors data changes (e.g., admin edits)
 * 
 * @example
 * const invalidateMentors = useInvalidateMentors();
 * invalidateMentors(); // Refresh all mentors queries
 */
export function useInvalidateMentors() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({
      queryKey: mentorsKeys.all,
    });
    
    console.log('[React Query] Invalidated all mentors queries');
  };
}
