'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { adminService } from './admin-service';
import { AdminAuthVerifyResponse } from './admin-types';

interface AdminContextType {
  adminUser: AdminAuthVerifyResponse | null;
  loading: boolean;
  isSuperAdmin: boolean;
  permissions: string[];
  refreshAdminSession: () => Promise<AdminAuthVerifyResponse | null>;
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminAuthVerifyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('gymgit_admin_sidebar_collapsed') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    try {
      localStorage.setItem('gymgit_admin_sidebar_collapsed', String(collapsed));
    } catch {}
  }, []);

  const toggleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('gymgit_admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  const refreshAdminSession = useCallback(async (): Promise<AdminAuthVerifyResponse | null> => {
    try {
      const verifyRes = await adminService.verifySession();
      if (verifyRes && (verifyRes.role === 'admin' || verifyRes.role === 'superadmin')) {
        setAdminUser(verifyRes);
        return verifyRes;
      }
      setAdminUser(null);
      return null;
    } catch (err) {
      console.warn('[AdminContext] Failed to verify admin privileges:', err);
      setAdminUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function initSession() {
      try {
        const verifyRes = await adminService.verifySession();
        if (isMounted) {
          if (verifyRes && (verifyRes.role === 'admin' || verifyRes.role === 'superadmin')) {
            setAdminUser(verifyRes);
          } else {
            setAdminUser(null);
          }
        }
      } catch {
        if (isMounted) {
          setAdminUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    initSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const isSuperAdmin = adminUser?.role === 'superadmin';
  const permissions = adminUser?.permissions || [];

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        loading,
        isSuperAdmin,
        permissions,
        refreshAdminSession,
        sidebarCollapsed,
        toggleSidebarCollapsed,
        setSidebarCollapsed,
        isMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextType {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

