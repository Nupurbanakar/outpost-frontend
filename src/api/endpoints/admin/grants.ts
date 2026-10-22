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

// Backend admin response format
interface AdminGrantResponse {
  id: string;
  name: string;
  issuingBody: string;
  issuingBodyType: string;
  type: string;
  summary: string;
  amountMin?: number;
  amountMax?: number;
  amountDisplay?: string;
  deadline?: string;
  sourceUrl: string;
  published: boolean;
  expired: boolean;
  stages: any[];
  sectors: any[];
  createdAt: string;
  updatedAt: string;
}

// Transform admin API response to Grant format
const transformAdminGrant = (adminGrant: AdminGrantResponse): Grant => {
  let status: 'DRAFT' | 'PUBLISHED' | 'EXPIRED' = 'DRAFT';
  if (adminGrant.expired) {
    status = 'EXPIRED';
  } else if (adminGrant.published) {
    status = 'PUBLISHED';
  }

  return {
    id: adminGrant.id,
    title: adminGrant.name, // Backend uses 'name', frontend uses 'title'
    summary: adminGrant.summary || '',
    issuingBody: adminGrant.issuingBody,
    issuingBodyType: adminGrant.issuingBodyType as any,
    type: adminGrant.type as any,
    amount: adminGrant.amountMin,
    amountBand: adminGrant.amountDisplay,
    deadline: adminGrant.deadline,
    sourceUrl: adminGrant.sourceUrl,
    eligibleStages: adminGrant.stages || [],
    eligibleSectors: adminGrant.sectors || [],
    status,
    createdAt: adminGrant.createdAt,
    updatedAt: adminGrant.updatedAt,
  };
};

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

    const response = await apiClient.get<PaginatedResponse<AdminGrantResponse>>(
      `/admin/grants?${params.toString()}`
    );
    
    // Transform each grant from admin format to frontend format
    return {
      ...response.data,
      content: response.data.content.map(transformAdminGrant),
    };
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
    const response = await apiClient.put<AdminGrantResponse>(`/admin/grants/${id}`, data);
    return transformAdminGrant(response.data);
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
