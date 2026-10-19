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
    await authApi.login(credentials);
    
    // Try to fetch user profile after successful login
    try {
      const userData = await foundersApi.getMe();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      // If /founders/me endpoint doesn't exist (404), create a basic user object
      if (error.response?.status === 404) {
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
