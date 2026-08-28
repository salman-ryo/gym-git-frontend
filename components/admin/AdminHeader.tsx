'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Globe, LogOut, ChevronRight, Shield } from 'lucide-react';
import { useAdmin } from '@/lib/admin-context';
import { useAuth } from '@/lib/auth-context';
import AdminStatusBadge from './ui/AdminStatusBadge';

export function AdminHeader() {
  const pathname = usePathname();
  const { adminUser } = useAdmin();
  const { logout } = useAuth();
  const [timeZone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  });

  // Format breadcrumbs from pathname
  const segments = pathname.split('/').filter(Boolean);

  return (
    <header className="h-16 sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-6 flex items-center justify-between">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-400">
        <Link
          href="/admin/dashboard"
          className="hover:text-white transition-colors font-medium flex items-center gap-1"
        >
          <Shield className="w-3.5 h-3.5 text-neon-cyan" />
          <span>Admin</span>
        </Link>

        {segments.map((seg, idx) => {
          if (seg === 'admin') return null;
          const href = '/' + segments.slice(0, idx + 1).join('/');
          const isLast = idx === segments.length - 1;
          const formatted = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');

          return (
            <React.Fragment key={href}>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              {isLast ? (
                <span className="text-white font-bold">{formatted}</span>
              ) : (
                <Link href={href} className="hover:text-white transition-colors">
                  {formatted}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Right Action Icons & Badges */}
      <div className="flex items-center gap-3">
        {/* Live Client Timezone */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <Globe className="w-3.5 h-3.5 text-neon-green" />
          <span>{timeZone}</span>
        </div>

        {adminUser && (
          <div className="flex items-center gap-2">
            <AdminStatusBadge role={adminUser.role} variant="role" size="sm" />
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          title="Sign Out"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-950/20 transition-all text-xs"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;

