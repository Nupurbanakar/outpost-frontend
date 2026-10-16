import apiClient from '../client';

export interface SpotlightFounder {
  id: string;
  founderName: string;
  startupName: string;
  oneLiner: string;
  photoUrl?: string;
}

export const spotlightApi = {
  /**
   * Get current spotlight founder
   * Returns 204 if no spotlight is active
   */
  getCurrentSpotlight: async (): Promise<SpotlightFounder | null> => {
    try {
      const response = await apiClient.get<SpotlightFounder>('/spotlight');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 204) {
        return null;
      }
      throw error;
    }
  },
};
