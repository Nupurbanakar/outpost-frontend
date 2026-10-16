import apiClient from '../client';
import type { PaginatedResponse } from '@/types';

export interface Challenge {
  id: string;
  title: string;
  corporateName: string;
  corporateLogo?: string;
  sector?: { id: string; name: string };
  theme?: string;
  deadline?: string;
  status: 'OPEN' | 'CLOSED';
  hasDetail: boolean;
  problemStatement?: string;
  whatTheyAreLookingFor?: string;
  eligibilityCriteria?: string;
  timeline?: string;
  offerType?: 'PILOT' | 'POC' | 'PARTNERSHIP';
  applyUrl: string;
  aiReason?: string;
}

export interface ChallengesFilters {
  sectorId?: string;
  theme?: string;
  corporate?: string;
  status?: 'OPEN' | 'CLOSED';
  q?: string;
  sort?: string;
  ai?: boolean;
  page?: number;
  size?: number;
}

export const challengesApi = {
  /**
   * Get paginated list of challenges with filters
   */
  getChallenges: async (filters: ChallengesFilters = {}): Promise<PaginatedResponse<Challenge>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedResponse<Challenge>>('/challenges', { params });
    return response.data;
  },

  /**
   * Get a single challenge by ID
   */
  getChallengeById: async (id: string): Promise<Challenge> => {
    const response = await apiClient.get<Challenge>(`/challenges/${id}`);
    return response.data;
  },

  /**
   * Get list of challenge themes
   */
  getThemes: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/challenges/themes');
    return response.data;
  },
};
