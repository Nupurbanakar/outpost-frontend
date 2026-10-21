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

export interface UpdateProfileRequest {
  founderName?: string;
  startupName?: string;
  stageId?: string;
  sectorId?: string;
  city?: string;
  website?: string;
  bio?: string;
  linkedInUrl?: string;
  twitterUrl?: string;
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
   * Get pitch deck URL
   */
  getPitchDeck: async (): Promise<{ url: string }> => {
    const response = await apiClient.get<{ url: string }>('/me/pitch-deck');
    return response.data;
  },

  /**
   * Delete pitch deck
   */
  deletePitchDeck: async (): Promise<void> => {
    await apiClient.delete('/me/pitch-deck');
  },
};
