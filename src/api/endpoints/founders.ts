import apiClient from '../client';
import type { User } from '@/types';

export interface OnboardingRequest {
  founderName: string;
  startupName: string;
  stageId: string;
  sectorId: string;
  city: string;
  website?: string;
}

export interface SocialLink {
  type: 'LINKEDIN' | 'X' | 'OTHER';
  url: string;
}

export interface UpdateProfileRequest {
  bio?: string;
  links?: SocialLink[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface Identity {
  provider: 'EMAIL' | 'GOOGLE';
  linkedAt: string;
}

export const foundersApi = {
  /**
   * Get current user profile
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/me');
    return response.data;
  },

  /**
   * Complete onboarding
   */
  completeOnboarding: async (data: OnboardingRequest): Promise<User> => {
    const response = await apiClient.post<User>('/me/onboarding', data);
    return response.data;
  },

  /**
   * Update profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.patch<User>('/me/profile', data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put('/me/password', data);
  },

  /**
   * Get linked identities
   */
  getIdentities: async (): Promise<Identity[]> => {
    const response = await apiClient.get<Identity[]>('/me/identities');
    return response.data;
  },

  /**
   * Unlink identity provider
   */
  unlinkIdentity: async (provider: 'EMAIL' | 'GOOGLE'): Promise<void> => {
    await apiClient.delete(`/me/identities/${provider}`);
  },

  /**
   * Upload pitch deck
   */
  uploadPitchDeck: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    await apiClient.put('/me/pitch-deck', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Return the URL immediately after successful upload
    const pitchDeckUrl = `${apiClient.defaults.baseURL}/me/pitch-deck`;
    return { url: pitchDeckUrl };
  },

  /**
   * Get pitch deck URL (backend redirects to actual file)
   * Note: Backend may return CORS error for HEAD, so we just construct the URL
   */
  getPitchDeck: async (): Promise<{ url: string }> => {
    // Try GET request and check if it redirects or returns 404
    try {
      await apiClient.get('/me/pitch-deck', {
        maxRedirects: 0,
        validateStatus: (status) => status === 302 || status === 200 || status === 404,
      });
      // If we get here without error, pitch deck exists
      const pitchDeckUrl = `${apiClient.defaults.baseURL}/me/pitch-deck`;
      return { url: pitchDeckUrl };
    } catch (err: any) {
      // 404 or CORS error means no pitch deck
      if (err.response?.status === 404) {
        throw err;
      }
      // For CORS or other errors, assume no pitch deck
      throw new Error('No pitch deck found');
    }
  },

  /**
   * Delete pitch deck
   */
  deletePitchDeck: async (): Promise<void> => {
    await apiClient.delete('/me/pitch-deck');
  },
};
