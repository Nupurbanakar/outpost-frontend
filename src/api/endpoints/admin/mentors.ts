import apiClient from '../../client';
import type { Mentor } from '../mentors';
import type { PaginatedResponse } from '@/types';

export interface AdminMentorsFilters {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  page?: number;
  size?: number;
}

export const adminMentorsApi = {
  /**
   * List all mentors (admin view - includes all statuses)
   */
  listMentors: async (filters: AdminMentorsFilters = {}): Promise<PaginatedResponse<Mentor>> => {
    const params = new URLSearchParams();
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.page !== undefined) {
      params.append('page', String(filters.page));
    }
    if (filters.size !== undefined) {
      params.append('size', String(filters.size));
    }

    console.log('🔍 Admin Mentors API call:', `/admin/mentors?${params.toString()}`);

    const response = await apiClient.get<PaginatedResponse<Mentor>>('/admin/mentors', { params });
    
    console.log('✅ Admin Mentors response:', response.data);
    
    return response.data;
  },

  /**
   * Approve a pending mentor
   */
  approveMentor: async (id: string): Promise<void> => {
    await apiClient.post(`/admin/mentors/${id}/approve`);
  },

  /**
   * Reject a pending mentor
   */
  rejectMentor: async (id: string): Promise<void> => {
    await apiClient.post(`/admin/mentors/${id}/reject`);
  },

  /**
   * Update mentor details
   */
  updateMentor: async (id: string, data: Partial<Mentor>): Promise<Mentor> => {
    const response = await apiClient.put<Mentor>(`/admin/mentors/${id}`, data);
    return response.data;
  },

  /**
   * Delete mentor (soft delete)
   */
  deleteMentor: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/mentors/${id}`);
  },
};
