import apiClient from '../client';
import type { PaginatedResponse } from '@/types';

export interface Grant {
  id: string;
  title: string;
  summary: string;
  issuingBody: string;
  issuingBodyType: 'CENTRAL' | 'STATE' | 'OTHER';
  type: 'GRANT' | 'SUBSIDY' | 'SCHEME' | 'INCENTIVE';
  amountMin?: number;
  amountMax?: number;
  deadline?: string;
  sourceUrl: string;
  eligibilityCriteria?: string;
  whatsFunded?: string;
  howToApply?: string;
  eligibleStages?: Array<{ id: string; name: string }>;
  eligibleSectors?: Array<{ id: string; name: string }>;
  status: 'DRAFT' | 'PUBLISHED' | 'EXPIRED';
  aiReason?: string;
}

export interface GrantsFilters {
  issuingBodyType?: 'CENTRAL' | 'STATE' | 'OTHER';
  type?: 'GRANT' | 'SUBSIDY' | 'SCHEME' | 'INCENTIVE';
  stageId?: string;
  sectorId?: string;
  amountBand?: 'UNDER_10L' | '10L_50L' | '50L_1CR' | 'OVER_1CR';
  deadline?: 'OPEN_NOW' | 'CLOSING_THIS_MONTH' | 'ROLLING';
  q?: string;
  ai?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export const grantsApi = {
  /**
   * Get paginated list of grants with filters
   * Founder endpoint - only returns PUBLISHED grants
   */
  getGrants: async (filters: GrantsFilters = {}): Promise<PaginatedResponse<Grant>> => {
    const params = new URLSearchParams();
    
    // Ensure only published grants are returned to founders
    params.append('status', 'PUBLISHED');
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedResponse<Grant>>('/grants', { params });
    return response.data;
  },

  /**
   * Get a single grant by ID
   */
  getGrantById: async (id: string): Promise<Grant> => {
    const response = await apiClient.get<Grant>(`/grants/${id}`);
    return response.data;
  },
};
