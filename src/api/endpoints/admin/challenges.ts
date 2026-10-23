import apiClient from '../../client';
import type { Challenge } from '../challenges';
import type { PaginatedResponse } from '@/types';

export interface AdminChallengeCreateRequest {
  title: string;
  corporateName: string;
  corporateLogo?: string;
  sectorId?: string;
  theme?: string;
  deadline?: string;
  problemStatement?: string;
  whatTheyAreLookingFor?: string;
  eligibilityCriteria?: string;
  timeline?: string;
  offerType?: 'PILOT' | 'POC' | 'PARTNERSHIP';
  applyUrl: string;
}

export interface AdminChallengeUpdateRequest extends AdminChallengeCreateRequest {}

export interface AdminChallengesFilters {
  status?: 'OPEN' | 'CLOSED';
  sectorId?: string;
  theme?: string;
  page?: number;
  size?: number;
}

export const adminChallengesApi = {
  /**
   * List all challenges (admin view)
   */
  listChallenges: async (filters: AdminChallengesFilters = {}): Promise<PaginatedResponse<Challenge>> => {
    const params = new URLSearchParams();
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.sectorId) {
      params.append('sectorId', filters.sectorId);
    }
    if (filters.theme) {
      params.append('theme', filters.theme);
    }
    if (filters.page !== undefined) {
      params.append('page', String(filters.page));
    }
    if (filters.size !== undefined) {
      params.append('size', String(filters.size));
    }

    console.log('🔍 Admin Challenges API call:', `/admin/challenges?${params.toString()}`);

    const response = await apiClient.get<PaginatedResponse<Challenge>>('/admin/challenges', { params });
    
    console.log('✅ Admin Challenges response:', response.data);
    
    return response.data;
  },

  /**
   * Create a new challenge
   */
  createChallenge: async (data: AdminChallengeCreateRequest): Promise<Challenge> => {
    const response = await apiClient.post<Challenge>('/admin/challenges', data);
    return response.data;
  },

  /**
   * Update challenge details
   */
  updateChallenge: async (id: string, data: AdminChallengeUpdateRequest): Promise<Challenge> => {
    const response = await apiClient.put<Challenge>(`/admin/challenges/${id}`, data);
    return response.data;
  },

  /**
   * Mark challenge as open
   */
  openChallenge: async (id: string): Promise<void> => {
    await apiClient.post(`/admin/challenges/${id}/open`);
  },

  /**
   * Mark challenge as closed
   */
  closeChallenge: async (id: string): Promise<void> => {
    await apiClient.post(`/admin/challenges/${id}/close`);
  },

  /**
   * Delete challenge
   */
  deleteChallenge: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/challenges/${id}`);
  },
};
