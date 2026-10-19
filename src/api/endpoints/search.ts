import api from '../client';

export interface SearchResult {
  id: string;
  type: 'grant' | 'challenge' | 'mentor';
  title: string;
  subtitle: string;
}

export interface SearchResponse {
  grants: Array<{
    id: string;
    name: string;
    issuingBody: string;
    type: string;
  }>;
  challenges: Array<{
    id: string;
    title: string;
    corporateName: string;
    sector: string;
  }>;
  mentors: Array<{
    id: string;
    name: string;
    headline: string;
  }>;
}

/**
 * Search across all content types
 * @param query - Search query string
 * @returns Combined search results from grants, challenges, and mentors
 */
export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    // Execute all searches in parallel
    const [grantsRes, challengesRes, mentorsRes] = await Promise.allSettled([
      api.get('/grants', { params: { q: query, size: 5 } }),
      api.get('/challenges', { params: { q: query, size: 5 } }),
      api.get('/mentors', { params: { q: query, size: 5 } }),
    ]);

    const results: SearchResult[] = [];

    // Process grants
    if (grantsRes.status === 'fulfilled') {
      const grants = grantsRes.value.data.content || [];
      results.push(
        ...grants.map((grant: any) => ({
          id: grant.id,
          type: 'grant' as const,
          title: grant.name,
          subtitle: `${grant.amountDisplay || 'Grant'} • ${grant.issuingBody}`,
        }))
      );
    }

    // Process challenges
    if (challengesRes.status === 'fulfilled') {
      const challenges = challengesRes.value.data.content || [];
      results.push(
        ...challenges.map((challenge: any) => ({
          id: challenge.id,
          type: 'challenge' as const,
          title: challenge.title,
          subtitle: `${challenge.corporateName} • ${challenge.sector}`,
        }))
      );
    }

    // Process mentors
    if (mentorsRes.status === 'fulfilled') {
      const mentors = mentorsRes.value.data.content || [];
      results.push(
        ...mentors.map((mentor: any) => ({
          id: mentor.id,
          type: 'mentor' as const,
          title: mentor.name,
          subtitle: mentor.headline || 'Mentor',
        }))
      );
    }

    return results;
  } catch (error) {
    console.error('Global search failed:', error);
    return [];
  }
}
