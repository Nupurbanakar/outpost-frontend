import apiClient from '../client';
import type { PaginatedResponse } from '@/types';

export interface Mentor {
  id: string;
  name: string;
  headline: string;
  bio: string;
  experience?: string;
  expertise: string[];
  photoUrl?: string;
  calComUrl: string;
  linkedInUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  aiReason?: string;
}

export interface MentorsFilters {
  expertise?: string | string[];
  stageId?: string;
  sectorId?: string;
  q?: string;
  ai?: boolean;
  page?: number;
  size?: number;
}

export interface MentorApplicationRequest {
  name: string;
  email: string;
  headline: string;
  bio: string;
  expertise: string[];
  calComUrl: string;
  photoUrl?: string;
  linkedInUrl?: string;
}

export const mentorsApi = {
  /**
   * Get paginated list of mentors with filters
   * Founder endpoint - only returns APPROVED mentors
   */
  getMentors: async (filters: MentorsFilters = {}): Promise<PaginatedResponse<Mentor>> => {
    const params = new URLSearchParams();
    
    // Ensure only approved mentors are returned to founders
    params.append('status', 'APPROVED');
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle multiple expertise filters
          value.forEach((v) => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await apiClient.get<PaginatedResponse<Mentor>>('/mentors', { params });
    return response.data;
  },

  /**
   * Get a single mentor by ID
   */
  getMentorById: async (id: string): Promise<Mentor> => {
    const response = await apiClient.get<Mentor>(`/mentors/${id}`);
    return response.data;
  },

  /**
   * Submit mentor application (public endpoint)
   */
  applyAsMentor: async (application: MentorApplicationRequest): Promise<void> => {
    await apiClient.post('/mentors/apply', application);
  },
};
