'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/admin-context';
import CyberpunkLoader from '@/components/CyberpunkLoader';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { adminUser, loading } = useAdmin();
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !adminUser) {
      router.push('/login?error=admin_unauthorized');
    }
  }, [adminUser, loading, router]);

  if (loading) {
    return <CyberpunkLoader fullScreen={true} text="Verifying Administrative Access" />;
  }

  if (!adminUser) {
    return null;
  }

  if (adminUser.status === 'suspended' || adminUser.status === 'banned') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight uppercase mb-2">
          Administrative Access Restricted
        </h1>
        <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
          Your administrative account status is currently <span className="font-bold text-rose-400 uppercase">[{adminUser.status}]</span>. Access to the command console has been locked.
        </p>
        <button
          onClick={() => logout()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Session
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export default AdminGuard;

