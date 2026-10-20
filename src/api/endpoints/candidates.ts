import api from '../client';
import type { PaginatedResponse } from '@/types';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  location: string;
  availability: 'IMMEDIATE' | 'TWO_WEEKS' | 'ONE_MONTH' | 'FLEXIBLE';
  skills: string[];
  summary: string;
  email?: string; // Only on detail view
  phone?: string; // Only on detail view
  resumeUrl?: string; // Only on detail view
  aiReason?: string;
}

export interface CandidatesFilters {
  role?: string;
  skills?: string[];
  experienceLevel?: string;
  location?: string;
  availability?: string;
  q?: string;
  ai?: boolean;
  page?: number;
  size?: number;
}

/**
 * Get paginated list of candidates
 */
export async function getCandidates(filters: CandidatesFilters = {}): Promise<PaginatedResponse<Candidate>> {
  const response = await api.get('/candidates', { params: filters });
  return {
    content: response.data.content,
    page: {
      number: response.data.page,
      size: response.data.size,
      totalElements: response.data.totalElements,
      totalPages: response.data.totalPages,
    },
  };
}

/**
 * Get candidate details by ID
 */
export async function getCandidateById(id: string): Promise<Candidate> {
  const response = await api.get(`/candidates/${id}`);
  return response.data;
}

/**
 * Get available roles for filtering
 */
export async function getCandidateRoles(): Promise<string[]> {
  const response = await api.get('/candidates/roles');
  return response.data;
}

/**
 * Get available skills for filtering
 */
export async function getCandidateSkills(): Promise<string[]> {
  const response = await api.get('/candidates/skills');
  return response.data;
}
