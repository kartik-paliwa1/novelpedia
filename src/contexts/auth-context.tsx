'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import * as authUtils from '@/utils/auth';
import { api, ApiError, type UserProfile } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { identifier: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const token = authUtils.getToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Query backend profile using SimpleJWT access token
  const profileResponse = await api.getProfile();
  const profile: UserProfile | null = profileResponse?.data ?? null;
      if (profile) {
        const fallbackProfile = profile as unknown as Record<string, any>;
        setUser({
          id: String(profile.id ?? fallbackProfile?.user?.id ?? ''),
          name: String(profile.name ?? fallbackProfile?.username ?? fallbackProfile?.user?.username ?? ''),
          email: String(profile.email ?? fallbackProfile?.user?.email ?? ''),
          avatar:
            (profile.imageURI ?? fallbackProfile?.avatar ?? fallbackProfile?.imageURI ?? fallbackProfile?.user?.avatar) ??
            undefined,
          role: profile.role ?? fallbackProfile?.user?.role ?? undefined,
        });
      } else {
        authUtils.removeToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authUtils.removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { identifier: string; password: string }) => {
    try {
      // Authenticate against backend so we receive SimpleJWT tokens
      const resp = await api.login(credentials);

      // If backend didn’t return profile, fetch it now
      let nextUser = (resp.data as any)?.user ?? null;
      if (!nextUser) {
        try {
          const profileResponse = await api.getProfile();
          nextUser = profileResponse?.data ?? null;
        } catch (e) {
          // swallow; will handle redirect regardless
        }
      }

      if (nextUser) {
        setUser({
          id: String(nextUser.id ?? nextUser.user?.id ?? ''),
          name: String(nextUser.name ?? nextUser.username ?? nextUser.user?.username ?? ''),
          email: String(nextUser.email ?? nextUser.user?.email ?? ''),
          avatar: nextUser.avatar ?? nextUser.user?.avatar ?? undefined,
          role: nextUser.role ?? nextUser.user?.role ?? undefined,
        });
      }

      // Handle redirect after login
      let redirectPath = localStorage.getItem('redirectAfterLogin');

      // Also check cookie (set by middleware)
      if (!redirectPath) {
        const cookies = document.cookie.split(';');
        const redirectCookie = cookies.find(cookie => cookie.trim().startsWith('redirectAfterLogin='));
        if (redirectCookie) {
          redirectPath = redirectCookie.split('=')[1];
          // Clear the cookie
          document.cookie = 'redirectAfterLogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      }

      const finalRedirect = redirectPath || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      router.push(finalRedirect);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : (error as Error)?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    authUtils.removeToken();
    setUser(null);
    router.push('/login');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
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
