import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration
 * 
 * Handles caching, refetching, and invalidation for all API queries
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes before considering it stale
      staleTime: 5 * 60 * 1000,
      
      // Keep unused cache data for 10 minutes
      gcTime: 10 * 60 * 1000,
      
      // Refetch when window regains focus
      refetchOnWindowFocus: true,
      
      // Refetch when network reconnects
      refetchOnReconnect: true,
      
      // Retry failed requests once
      retry: 1,
      
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});
