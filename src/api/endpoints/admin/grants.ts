import apiClient from '../../client';
import type { Grant } from '../grants';
import type { PaginatedResponse } from '@/types';

export interface AdminGrantCreateRequest {
  name: string;
  issuingBody: string;
  issuingBodyType: 'CENTRAL' | 'STATE' | 'OTHER';
  type: 'GRANT' | 'SUBSIDY' | 'SCHEME' | 'INCENTIVE';
  summary?: string;
  amountMin?: number;
  amountMax?: number;
  deadline?: string;
  sourceUrl: string;
  eligibilityCriteria?: string;
  whatsFunded?: string;
  howToApply?: string;
  eligibleStageIds?: string[];
  eligibleSectorIds?: string[];
}

export interface AdminGrantUpdateRequest extends AdminGrantCreateRequest {}

export interface AdminGrantsFilters {
  status?: 'DRAFT' | 'PUBLISHED' | 'EXPIRED';
  issuingBodyType?: 'CENTRAL' | 'STATE' | 'OTHER';
  type?: 'GRANT' | 'SUBSIDY' | 'SCHEME' | 'INCENTIVE';
  page?: number;
  size?: number;
}

export const adminGrantsApi = {
  /**
   * List all grants (admin view - includes drafts and expired)
   */
  listGrants: async (filters: AdminGrantsFilters = {}): Promise<PaginatedResponse<Grant>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedResponse<Grant>>(
      `/admin/grants?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get grant by ID
   */
  getGrant: async (id: string): Promise<Grant> => {
    const response = await apiClient.get<Grant>(`/admin/grants/${id}`);
    return response.data;
  },

  /**
   * Create new grant
   */
  createGrant: async (data: AdminGrantCreateRequest): Promise<Grant> => {
    const response = await apiClient.post<Grant>('/admin/grants', data);
    return response.data;
  },

  /**
   * Update grant
   */
  updateGrant: async (id: string, data: AdminGrantUpdateRequest): Promise<Grant> => {
    const response = await apiClient.put<Grant>(`/admin/grants/${id}`, data);
    return response.data;
  },

  /**
   * Delete grant
   */
  deleteGrant: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/grants/${id}`);
  },

  /**
   * Publish grant
   */
  publishGrant: async (id: string): Promise<void> => {
    await apiClient.post(`/admin/grants/${id}/publish`);
  },

  /**
   * Unpublish grant
   */
  unpublishGrant: async (id: string): Promise<void> => {
    await apiClient.post(`/admin/grants/${id}/unpublish`);
  },

  /**
   * Expire grant
   */
  expireGrant: async (id: string): Promise<void> => {
    await apiClient.post(`/admin/grants/${id}/expire`);
  },
};
