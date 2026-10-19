import api from '../client';

export interface PublicFounderProfile {
  id: string;
  founderName: string;
  startupName: string;
  bio?: string;
  city?: string;
  website?: string;
  linkedInUrl?: string;
  twitterUrl?: string;
  stage?: {
    id: string;
    name: string;
  };
  sector?: {
    id: string;
    name: string;
  };
}

/**
 * Get public founder profile
 * @param id - Founder ID
 */
export async function getPublicFounderProfile(id: string): Promise<PublicFounderProfile> {
  const response = await api.get(`/founders/${id}/profile`);
  return response.data;
}
