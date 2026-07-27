'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { api } from '@/utils/api';
import { User, WeeklyPlan } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string, plan?: WeeklyPlan) => Promise<void>;
  signup: (email: string, pass: string, name?: string, plan?: WeeklyPlan) => Promise<void>;
  loginWithGoogle: (plan?: WeeklyPlan) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPlan: (plan: WeeklyPlan) => Promise<void>;
  bootstrapBackend: (selectedPlan?: WeeklyPlan, accessToken?: string) => Promise<User | null>;
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
    accessToken?: string
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

      // 2. Fetch complete user profile & active weekly plan from Go backend
      const fullProfile = await api.get<User>('/auth/me', { token });
      setUser(fullProfile);
      return fullProfile;
    } catch (err) {
      console.error('Backend bootstrap/me call failed:', err);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    async function loadUser() {
      // Real Supabase Session initialization
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

        // Listen to auth state changes (e.g. sign in, sign out, token refresh)
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: string, currentSession: any) => {
          if (event === 'SIGNED_IN' && currentSession?.access_token) {
            await bootstrapBackend(undefined, currentSession.access_token);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Failed to initialize Supabase session', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const handleLogin = async (email: string, pass: string, plan?: WeeklyPlan) => {
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
        // Pass fresh access token directly to bootstrapBackend
        await bootstrapBackend(plan, data.session.access_token);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (
    email: string,
    pass: string,
    name?: string,
    plan?: WeeklyPlan
  ) => {
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
        await bootstrapBackend(plan, data.session.access_token);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (_plan?: WeeklyPlan) => {
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

  const handleUpdatePlan = async (plan: WeeklyPlan) => {
    const updatedUser = await api.put<User>('/auth/plan', { plan });
    setUser(updatedUser);
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
        updateUserPlan: handleUpdatePlan,
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
