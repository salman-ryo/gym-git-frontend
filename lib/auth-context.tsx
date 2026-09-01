'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { api } from '@/utils/api';
import { User, WeeklyPlan, UserStreak, RawAuthMeResponse } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string, plan?: WeeklyPlan) => Promise<User | null>;
  signup: (email: string, pass: string, name?: string, plan?: WeeklyPlan) => Promise<User | null>;
  loginWithGoogle: (plan?: WeeklyPlan) => Promise<void>;
  logout: () => Promise<void>;
  bootstrapBackend: (selectedPlan?: WeeklyPlan, accessToken?: string) => Promise<User | null>;
}

function mapBackendUser(data: RawAuthMeResponse): User {
  if (!data) {
    return {
      email: '',
      name: '',
      provider: 'email',
    };
  }

  const u = data.user || data;

  return {
    id: u.id || (data as Record<string, unknown>).id as string | undefined,
    email: u.email || '',
    name: u.name || (u.email ? u.email.split('@')[0] : 'Gymbro'),
    avatarUrl: u.avatar_url || u.avatarUrl,
    provider: u.provider || 'email',
    role: u.role || data.role || (data as Record<string, unknown>).role as string | undefined || 'user',
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Hits the Go backend POST /api/v1/auth/bootstrap endpoint,
   * followed by GET /api/v1/auth/me to retrieve the full application profile.
   */
  const bootstrapBackend = async (
    selectedPlan?: WeeklyPlan,
    accessToken?: string,
    shouldThrow = false
  ): Promise<User | null> => {
    const planId = selectedPlan?.id || 'ppl-standard';

    // Retrieve active access token from argument or Supabase client session
    let token = accessToken;
    if (!token) {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      token = session?.access_token;
    }

    if (!token) {
      console.warn('[Bootstrap] No access token available yet for bootstrap call.');
      setUser(null);
      return null;
    }

    try {
      // 1. CRITICAL BOOTSTRAP STEP: Create backend user profile idempotently
      await api.post('/auth/bootstrap', { selectedPlanId: planId }, { token });

      // 2. Fetch complete user profile from Go backend
      const rawProfileData = await api.get<RawAuthMeResponse>('/auth/me', { token });
      const mappedUser = mapBackendUser(rawProfileData);
      setUser(mappedUser);
      return mappedUser;
    } catch (err) {
      console.error('Backend bootstrap/me call failed:', err);
      setUser(null);
      if (shouldThrow) {
        throw err;
      }
      return null;
    }
  };

  useEffect(() => {
    let subscriptionRef: { unsubscribe: () => void } | null = null;

    async function loadUser() {
      try {
        const supabase = createBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.access_token) {
          await bootstrapBackend(undefined, session.access_token);
        } else {
          setUser(null);
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: string, currentSession: { access_token?: string } | null) => {
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && currentSession?.access_token) {
            await bootstrapBackend(undefined, currentSession.access_token);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        });

        subscriptionRef = subscription;
      } catch (err) {
        console.error('Failed to initialize Supabase session', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();

    return () => {
      if (subscriptionRef) {
        subscriptionRef.unsubscribe();
      }
    };
  }, []);

  const handleLogin = async (email: string, pass: string, plan?: WeeklyPlan): Promise<User | null> => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session?.access_token) {
        return await bootstrapBackend(plan, data.session.access_token, true);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (
    email: string,
    pass: string,
    name?: string,
    plan?: WeeklyPlan
  ): Promise<User | null> => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session?.access_token) {
        return await bootstrapBackend(plan, data.session.access_token, true);
      } else if (data.user) {
        throw new Error("Verification email sent! Please check your inbox and verify your email to log in.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (plan?: WeeklyPlan) => {
    void plan;
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      try {
        await api.post('/auth/logout');
      } catch {
        // Ignore backend logout error if backend is unavailable
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        signup: handleSignup,
        loginWithGoogle: handleGoogleLogin,
        logout: handleLogout,
        bootstrapBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
