import api from '../client';
import type { PaginatedResponse } from '@/types';

export interface Benefit {
  id: string;
  partnerName: string;
  partnerLogoUrl?: string;
  category: string;
  headline: string;
  description: string;
  whatYouGet: string;
  eligibility: string;
  howToClaim: string;
  claimUrl?: string;
  claimCode?: string;
  validUntil?: string;
  status: 'ACTIVE' | 'EXPIRED';
  featured: boolean;
  aiReason?: string;
}

export interface BenefitsFilters {
  category?: string;
  partner?: string;
  q?: string;
  includeExpired?: boolean;
  ai?: boolean;
  page?: number;
  size?: number;
}

/**
 * Get paginated list of benefits
 */
export async function getBenefits(filters: BenefitsFilters = {}): Promise<PaginatedResponse<Benefit>> {
  const response = await api.get('/benefits', { params: filters });
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
 * Get featured benefits
 */
export async function getFeaturedBenefits(): Promise<Benefit[]> {
  const response = await api.get('/benefits/featured');
  return response.data;
}

/**
 * Get benefit details by ID
 */
export async function getBenefitById(id: string): Promise<Benefit> {
  const response = await api.get(`/benefits/${id}`);
  return response.data;
}

/**
 * Get available categories for filtering
 */
export async function getBenefitCategories(): Promise<string[]> {
  const response = await api.get('/benefits/categories');
  return response.data;
}

/**
 * Get available partners for filtering
 */
export async function getBenefitPartners(): Promise<string[]> {
  const response = await api.get('/benefits/partners');
  return response.data;
}
