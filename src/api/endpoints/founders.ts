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
   * Check if pitch deck exists
   * Returns null if no pitch deck, otherwise returns the URL
   */
  hasPitchDeck: async (): Promise<string | null> => {
    try {
      // Try to get pitch deck metadata (not the file itself)
      // If this endpoint doesn't exist, we'll get 404
      const response = await apiClient.get<{ fileName: string; sizeBytes: number }>('/me/pitch-deck/info');
      if (response.data?.fileName) {
        // Pitch deck exists, return URL
        return `${apiClient.defaults.baseURL}/me/pitch-deck`;
      }
      return null;
    } catch (err: any) {
      // 404 means no pitch deck exists
      return null;
    }
  },

  /**
   * Delete pitch deck
   */
  deletePitchDeck: async (): Promise<void> => {
    await apiClient.delete('/me/pitch-deck');
  },
};
