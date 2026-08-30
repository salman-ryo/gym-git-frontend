'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  Trophy,
  Dumbbell,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';
import { useAdmin } from '@/lib/admin-context';
import AdminStatusBadge from './ui/AdminStatusBadge';
import AdminUserAvatar from './ui/AdminUserAvatar';

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Users Directory',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Items Catalog',
    href: '/admin/catalog/items',
    icon: Package,
  },
  {
    label: 'Reward Roadmaps',
    href: '/admin/catalog/rewards',
    icon: Trophy,
  },
  {
    label: 'Preset Splits',
    href: '/admin/catalog/presets',
    icon: Dumbbell,
  },
  {
    label: 'Audit Trail Logs',
    href: '/admin/audit-logs',
    icon: ScrollText,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const {
    adminUser,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    isMobileSidebarOpen,
    closeMobileSidebar,
  } = useAdmin();

  const renderNavContent = (isMobile = false) => {
    const isCollapsed = !isMobile && sidebarCollapsed;

    return (
      <div className="flex flex-col justify-between h-full">
        {/* Brand Header & Navigation */}
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/80">
            {!isCollapsed ? (
              <Link
                href="/admin/dashboard"
                onClick={isMobile ? closeMobileSidebar : undefined}
                className="flex items-center gap-3 no-underline group cursor-pointer"
              >
                <div className="rounded-xl shrink-0 overflow-hidden border border-zinc-800 bg-zinc-900 shadow-[0_0_12px_rgba(0,255,136,0.15)] group-hover:shadow-[0_0_18px_rgba(0,255,136,0.3)] transition-all">
                  <Image
                    src="/web-app-manifest-512x512.png"
                    alt="Gym-Git Logo"
                    width={36}
                    height={36}
                    className="w-9 h-9 transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-wider bg-gradient-to-r from-neon-green via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                      GYM-GIT
                    </span>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan">
                      ADMIN
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-none">Backoffice Command</p>
                </div>
              </Link>
            ) : (
              <Link
                href="/admin/dashboard"
                title="Gym-Git Admin Overview"
                className="mx-auto block group"
              >
                <div className="rounded-xl shrink-0 overflow-hidden border border-zinc-800 bg-zinc-900 shadow-[0_0_12px_rgba(0,255,136,0.15)] group-hover:shadow-[0_0_18px_rgba(0,255,136,0.35)] transition-all group-hover:scale-105">
                  <Image
                    src="/web-app-manifest-512x512.png"
                    alt="Gym-Git Logo"
                    width={36}
                    height={36}
                    className="w-9 h-9"
                  />
                </div>
              </Link>
            )}

            {/* Collapse toggle (Desktop) or Close button (Mobile) */}
            {isMobile ? (
              <button
                onClick={closeMobileSidebar}
                aria-label="Close sidebar"
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={toggleSidebarCollapsed}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors hidden lg:flex"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5" aria-label="Admin Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  onClick={isMobile ? closeMobileSidebar : undefined}
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
                  } rounded-xl text-xs font-semibold border transition-colors duration-150 group relative ${
                    isActive
                      ? 'bg-zinc-900 border-neon-cyan/40 text-white shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                      : 'border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 hover:border-zinc-800/80'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-neon-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  )}
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                      isActive ? 'text-neon-cyan' : 'text-zinc-400 group-hover:text-neon-cyan'
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Quick Links & User Identity */}
        <div className="p-3 border-t border-zinc-800/80 space-y-2">
          <Link
            href="/dashboard"
            title={isCollapsed ? 'Switch to Athlete App' : undefined}
            onClick={isMobile ? closeMobileSidebar : undefined}
            className={`flex items-center ${
              isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
            } rounded-xl text-xs font-semibold text-zinc-400 hover:text-neon-green hover:bg-neon-green/10 border border-transparent hover:border-neon-green/30 transition-colors duration-150 group`}
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-zinc-400 group-hover:text-neon-green transition-colors duration-150" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span>Athlete App</span>
                <Sparkles className="w-3.5 h-3.5 text-neon-green opacity-80" />
              </div>
            )}
          </Link>

          {/* Current Admin Identity Card */}
          {adminUser && !isCollapsed && (
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden min-w-0">
                <AdminUserAvatar
                  src={
                    adminUser.avatar_url ||
                    adminUser.avatarUrl ||
                    ((adminUser as unknown as Record<string, unknown>).avatar as string | undefined) ||
                    ((adminUser as unknown as Record<string, unknown>).picture as string | undefined)
                  }
                  name={adminUser.name}
                  email={adminUser.email}
                  size="xs"
                  shape="circle"
                />
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs font-bold text-white truncate">{adminUser.name || 'Admin'}</p>
                  <p className="text-[10px] text-zinc-500 truncate font-mono">{adminUser.email}</p>
                </div>
              </div>
              <AdminStatusBadge role={adminUser.role} variant="role" size="sm" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={closeMobileSidebar}
          aria-hidden="true"
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Drawer Aside */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-zinc-950/98 backdrop-blur-2xl border-r border-zinc-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderNavContent(true)}
      </aside>

      {/* Desktop Fixed Aside */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 bottom-0 z-40 bg-zinc-950/95 backdrop-blur-2xl border-r border-zinc-800/80 flex-col justify-between transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderNavContent(false)}
      </aside>
    </>
  );
}

export default AdminSidebar;

