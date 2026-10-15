import apiClient from './client';
import type { AuthResponse, LoginRequest, SignupRequest } from '@/types';

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Sign up a new founder
   */
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  /**
   * Logout: Clear local storage and redirect
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/founders/me');
    return response.data;
  },
};
