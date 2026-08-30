'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, LogOut, ChevronRight, Menu, PanelLeft } from 'lucide-react';
import { useAdmin } from '@/lib/admin-context';
import { useAuth } from '@/lib/auth-context';
import AdminStatusBadge from './ui/AdminStatusBadge';

export function AdminHeader() {
  const pathname = usePathname();
  const { adminUser, sidebarCollapsed, toggleSidebarCollapsed, toggleMobileSidebar } = useAdmin();
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
    <header className="h-16 sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left Area: Mobile Menu Trigger + Desktop Toggle + Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={toggleMobileSidebar}
          aria-label="Open mobile navigation"
          className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors lg:hidden shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={toggleSidebarCollapsed}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors hidden lg:flex items-center justify-center shrink-0"
        >
          <PanelLeft className={`w-4 h-4 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-400 truncate">
          <Link
            href="/admin/dashboard"
            className="hover:text-white transition-colors font-medium flex items-center gap-1.5 text-zinc-300 shrink-0 group"
          >
            <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 border border-zinc-800 bg-zinc-900 group-hover:border-neon-cyan/40 transition-colors">
              <Image
                src="/web-app-manifest-512x512.png"
                alt="Gym-Git"
                width={20}
                height={20}
                className="w-full h-full object-cover"
              />
            </div>
            <span>Admin</span>
          </Link>

          {segments.map((seg, idx) => {
            if (seg === 'admin') return null;
            const href = '/' + segments.slice(0, idx + 1).join('/');
            const isLast = idx === segments.length - 1;
            const formatted = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');

            return (
              <React.Fragment key={href}>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                {isLast ? (
                  <span className="text-white font-bold truncate">{formatted}</span>
                ) : (
                  <Link href={href} className="hover:text-white transition-colors truncate">
                    {formatted}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right Action Icons & Badges */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Live Client Timezone */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
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

