'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import CyberpunkLoader from '@/components/CyberpunkLoader';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <CyberpunkLoader fullScreen={true} text="Authenticating" />;
  }

  if (!user) {
    return <CyberpunkLoader fullScreen={true} text="Redirecting to Login..." />;
  }

  return <>{children}</>;
}