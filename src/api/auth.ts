import apiClient from './client';
import type { LoginRequest, SignupRequest } from '@/types';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const authApi = {
  /**
   * Login with email and password
   * Returns tokens only - fetch user separately with GET /me
   */
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/login', credentials);
    const { accessToken, refreshToken } = response.data;
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return response.data;
  },

  /**
   * Sign up a new founder
   * Returns tokens only - fetch user separately with GET /me
   */
  signup: async (data: SignupRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/signup', data);
    const { accessToken, refreshToken } = response.data;
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   */
  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data;
  },

  /**
   * Logout: Clear local storage and redirect
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/auth/verify', { token });
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<void> => {
    await apiClient.post('/auth/resend-verification', { email });
  },
};
