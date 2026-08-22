'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { api } from '@/utils/api';
import { User, WeeklyPlan, UserStreak, RawAuthMeResponse } from './types';

interface AuthContextType {
  user: User | null;
  streak: UserStreak | null;
  loading: boolean;
  login: (email: string, pass: string, plan?: WeeklyPlan) => Promise<void>;
  signup: (email: string, pass: string, name?: string, plan?: WeeklyPlan) => Promise<void>;
  loginWithGoogle: (plan?: WeeklyPlan) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPlan: (plan: WeeklyPlan) => Promise<void>;
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
  const p = data.plan || u.weeklyPlan;
  
  let streakObj: UserStreak | undefined;
  if (data.streak) {
    const s = data.streak;
    streakObj = {
      currentStreak: s.current_streak ?? s.currentStreak ?? 0,
      longestStreak: s.longest_streak ?? s.longestStreak ?? 0,
      complianceRate: s.compliance_rate ?? s.complianceRate ?? 0,
      cycleInfo: s.cycle_info ? {
        cycle_start_date: s.cycle_info.cycle_start_date,
        cycle_end_date: s.cycle_info.cycle_end_date,
        workouts_completed_in_cycle: s.cycle_info.workouts_completed_in_cycle,
        workouts_target_in_cycle: s.cycle_info.workouts_target_in_cycle,
        rest_tokens_total: s.cycle_info.rest_tokens_total,
        rest_tokens_used: s.cycle_info.rest_tokens_used,
        rest_tokens_remaining: s.cycle_info.rest_tokens_remaining,
        days_remaining_in_cycle: s.cycle_info.days_remaining_in_cycle,
      } : undefined,
      accuracyScore: s.accuracy_score ?? s.accuracyScore ?? 0,
      isFrozen: s.is_frozen ?? s.isFrozen ?? false,
      streakBrokenEvent: s.streak_broken_event ? {
        previous_streak: s.streak_broken_event.previous_streak,
        last_streak_date: s.streak_broken_event.last_streak_date,
        broken_on: s.streak_broken_event.broken_on,
        missed_days_count: s.streak_broken_event.missed_days_count,
        required_shields: s.streak_broken_event.required_shields,
        restore_shield_available: s.streak_broken_event.restore_shield_available,
        restore_shields_count: s.streak_broken_event.restore_shields_count,
        missed_dates: s.streak_broken_event.missed_dates,
        can_restore_until: s.streak_broken_event.can_restore_until,
      } : null,
      streakWarningEvent: s.streak_warning_event ? {
        is_at_risk: s.streak_warning_event.is_at_risk,
        hours_remaining: s.streak_warning_event.hours_remaining,
        rest_tokens_left: s.streak_warning_event.rest_tokens_left,
        message: s.streak_warning_event.message,
      } : null,
    };
  }

  return {
    email: u.email || '',
    name: u.name || (u.email ? u.email.split('@')[0] : 'Gymbro'),
    avatarUrl: u.avatar_url || u.avatarUrl,
    provider: u.provider || 'email',
    weeklyPlan: p
      ? {
          id: p.id,
          name: p.name,
          description: p.description,
          categories: p.categories || [],
        }
      : undefined,
    queuedWeeklyPlanId: u.queued_weekly_plan_id || u.queuedWeeklyPlanId || null,
    streak: streakObj,
    checkinSnooze: data.checkin_snooze ? {
      date: data.checkin_snooze.date,
      snoozed_at: data.checkin_snooze.snoozed_at,
      is_snoozed: data.checkin_snooze.is_snoozed,
      remaining_seconds: data.checkin_snooze.remaining_seconds,
    } : undefined,
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
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
      setStreak(null);
      return null;
    }

    try {
      // 1. CRITICAL BOOTSTRAP STEP: Create backend user profile idempotently
      await api.post('/auth/bootstrap', { selectedPlanId: planId }, { token });

      // 2. Fetch complete user profile & active weekly plan from Go backend
      const rawProfileData = await api.get<RawAuthMeResponse>('/auth/me', { token });
      const mappedUser = mapBackendUser(rawProfileData);
      setUser(mappedUser);
      setStreak(mappedUser.streak || null);
      return mappedUser;
    } catch (err) {
      console.error('Backend bootstrap/me call failed:', err);
      setUser(null);
      setStreak(null);
      if (shouldThrow) {
        throw err;
      }
      return null;
    }
  };

  useEffect(() => {
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
          setStreak(null);
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: string, currentSession: { access_token?: string } | null) => {
          if (event === 'SIGNED_IN' && currentSession?.access_token) {
            await bootstrapBackend(undefined, currentSession.access_token);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setStreak(null);
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
        await bootstrapBackend(plan, data.session.access_token, true);
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
        await bootstrapBackend(plan, data.session.access_token, true);
      } else if (data.user) {
        throw new Error("Verification email sent! Please check your inbox and verify your email to log in.");
      }
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
      setStreak(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (plan: WeeklyPlan) => {
    const payload: Record<string, unknown> = { plan_id: plan.id };
    if (plan.id === 'custom-plan') {
      payload.name = plan.name;
      payload.description = plan.description;
      payload.categories = plan.categories;
    }
    await api.put('/auth/plan', payload);
    if (user) {
      setUser({ ...user, weeklyPlan: plan });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        streak,
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
