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
  uploadPitchDeck: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await apiClient.put('/me/pitch-deck', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get pitch deck URL (backend redirects to actual file)
   */
  getPitchDeck: async (): Promise<{ url: string }> => {
    try {
      console.log('Checking if pitch deck exists...');
      // Use HEAD request with maxRedirects: 0 to prevent following redirect
      const response = await apiClient.head('/me/pitch-deck', {
        maxRedirects: 0,
        validateStatus: (status) => status === 302 || status === 200,
      });
      console.log('HEAD response:', response.status, response.headers);
      // If 302 or 200, pitch deck exists - return the URL
      const pitchDeckUrl = `${apiClient.defaults.baseURL}/me/pitch-deck`;
      console.log('Pitch deck URL:', pitchDeckUrl);
      return { url: pitchDeckUrl };
    } catch (err: any) {
      // 404 means no pitch deck exists
      console.log('Pitch deck check failed:', err.response?.status, err.message);
      throw err;
    }
  },

  /**
   * Delete pitch deck
   */
  deletePitchDeck: async (): Promise<void> => {
    await apiClient.delete('/me/pitch-deck');
  },
};
