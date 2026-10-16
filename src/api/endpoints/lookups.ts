import apiClient from '../client';
import type { Stage, Sector } from '@/types';

export const lookupsApi = {
  /**
   * Get list of all stages
   */
  getStages: async (): Promise<Stage[]> => {
    const response = await apiClient.get<Stage[]>('/lookups/stages');
    return response.data;
  },

  /**
   * Get list of all sectors
   */
  getSectors: async (): Promise<Sector[]> => {
    const response = await apiClient.get<Sector[]>('/lookups/sectors');
    return response.data;
  },
};
