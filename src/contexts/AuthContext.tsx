import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, foundersApi } from '@/api';
import type { User, LoginRequest, SignupRequest } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing tokens and validate on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Validate token by fetching user profile
        const userData = await foundersApi.getMe();
        setUser(userData);
      } catch (error) {
        // Token invalid or expired, clear storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    console.log('Attempting login with email:', credentials.email);
    
    try {
      await authApi.login(credentials);
      console.log('Login API call successful, tokens stored');
    } catch (error: any) {
      // Clear tokens if login failed
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw error;
    }
    
    // Try to fetch user profile after successful login
    try {
      console.log('Fetching user profile from /founders/me');
      const userData = await foundersApi.getMe();
      console.log('User data fetched successfully:', userData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      // If 401, user might not be verified - create error with EMAIL_NOT_VERIFIED code
      if (error.response?.status === 401) {
        console.error('User not verified or unauthorized:', error);
        // Clear tokens since we can't access the profile
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Throw error with EMAIL_NOT_VERIFIED code
        const verificationError = new Error('Please verify your email before logging in');
        (verificationError as any).response = {
          status: 401,
          data: { 
            error: 'EMAIL_NOT_VERIFIED',
            message: 'Please verify your email before logging in'
          }
        };
        throw verificationError;
      } else if (error.response?.status === 404) {
        console.warn('Backend /founders/me endpoint not found, using basic user data');
        const basicUser = {
          id: 0,
          email: credentials.email,
          firstName: null,
          lastName: null,
          role: 'founder',
          isVerified: true,
          isOnboarded: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(basicUser as any);
        localStorage.setItem('user', JSON.stringify(basicUser));
      } else {
        console.error('Failed to fetch user profile:', error);
        // Clear tokens on error
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw error;
      }
    }
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    await authApi.signup(data);
    // Fetch user profile after successful signup
    const userData = await foundersApi.getMe();
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await foundersApi.getMe();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
