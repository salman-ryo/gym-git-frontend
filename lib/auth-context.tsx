'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockGetSession, mockGoogleLogin, mockLogin, mockLogout, mockUpdateUserPlan } from './api-mock';
import { User, WeeklyPlan } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string, plan?: WeeklyPlan) => Promise<void>;
  loginWithGoogle: (plan?: WeeklyPlan) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPlan: (plan: WeeklyPlan) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const activeUser = await mockGetSession();
        setUser(activeUser);
      } catch (err) {
        console.error('Failed to load user session', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleLogin = async (email: string, pass: string, plan?: WeeklyPlan) => {
    setLoading(true);
    try {
      const loggedUser = await mockLogin(email, pass, plan);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (plan?: WeeklyPlan) => {
    setLoading(true);
    try {
      const loggedUser = await mockGoogleLogin(plan);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await mockLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (plan: WeeklyPlan) => {
    const updated = await mockUpdateUserPlan(plan);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        loginWithGoogle: handleGoogleLogin,
        logout: handleLogout,
        updateUserPlan: handleUpdatePlan,
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
