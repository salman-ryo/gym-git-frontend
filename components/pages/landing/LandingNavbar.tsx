'use client';

import './LandingNavbar.css';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Changelog', href: '#changelog' },
  { label: 'Blog', href: '#blog' },
];

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

/** Neon-glow logo mark */
function LogoMark() {
  return (
    <div className="relative w-[38px] h-[38px] rounded-[10px] overflow-hidden flex-shrink-0 group" aria-hidden="true">
      <Image
        src="/web-app-manifest-192x192.png"
        alt=""
        width={192}
        height={192}
        className="w-full h-full object-cover relative z-10"
        priority
      />
      {/* Neon glow ring behind the logo */}
      <div className="absolute -inset-[2px] rounded-[12px] bg-[conic-gradient(from_0deg,var(--neon-green-glow),transparent_60%,var(--neon-cyan-glow),transparent_100%)] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-[logo-glow-spin_6s_linear_infinite]" />
    </div>
  );
}

/** Brand wordmark */
function Wordmark() {
  return (
    <span className="text-lg font-black tracking-wider leading-none select-none" aria-label="Gym Git">
      <span className="text-[#e4e4e7]">GYM</span>{' '}
      <span className="bg-gradient-to-br from-neon-green to-neon-cyan bg-clip-text text-transparent">GIT</span>
    </span>
  );
}

/** Desktop nav links */
function DesktopNavLinks() {
  return (
    <nav className="hidden lg:flex items-center justify-center flex-1" aria-label="Main navigation">
      <ul className="flex items-center gap-1 list-none m-0 p-0" role="list">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="relative flex items-center px-4 py-2 text-[#a1a1aa] text-[13.5px] font-medium tracking-wide no-underline rounded-lg hover:text-[#fafafa] hover:bg-neon-green-subtle transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-neon-green focus-visible:outline-offset-2 group"
            >
              <span className="relative z-10">{link.label}</span>
              <span className="absolute bottom-1 left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-neon-green to-neon-cyan shadow-[0_0_8px_var(--neon-green-glow)] rounded-[1px] -translate-x-1/2 group-hover:w-[60%] transition-all duration-300 ease-out" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** GitHub star link */
function GitHubStarLink() {
  return (
    <a
      href="https://github.com/gymgit"
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-[#a1a1aa] text-[13px] font-medium no-underline border border-[rgba(63,63,70,0.6)] rounded-lg bg-[rgba(24,24,27,0.5)] hover:text-[#fafafa] hover:border-[rgba(161,161,170,0.3)] hover:bg-[rgba(39,39,42,0.6)] hover:shadow-sm transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-neon-green focus-visible:outline-offset-2"
      aria-label="Star Gym Git on GitHub"
    >
      <Star className="w-3.5 h-3.5" />
      <span className="whitespace-nowrap">Star on GitHub</span>
    </a>
  );
}

function LaunchAppButton() {
  const handleClick = () => {
    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      import("@/lib/appLauncher").then(
        ({ openMobileApp }) => {
          openMobileApp();
        }
      );
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[13.5px] font-semibold text-[#080c10] rounded-lg bg-gradient-to-r from-neon-green to-[#00e077] overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_20px_var(--neon-green-glow),0_4px_16px_-4px_rgba(0,255,136,0.3)] active:scale-100 transition-all duration-200 border-none outline-none cursor-pointer group"
    >
      <span className="relative z-10 whitespace-nowrap">
        Login
      </span>

      <ChevronRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />

      <span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-[120%] group-hover:animate-[shimmer-effect_0.8s_ease_forwards]"
        aria-hidden="true"
      />
    </button>
  );
}

/** Mobile menu toggle */
function MobileMenuToggle({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="lg:hidden flex items-center justify-center w-10 h-10 bg-transparent border border-[rgba(63,63,70,0.5)] rounded-lg cursor-pointer hover:bg-[rgba(39,39,42,0.6)] hover:border-[rgba(0,255,136,0.2)] focus-visible:outline-2 focus-visible:outline-neon-green focus-visible:outline-offset-2 transition-all"
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
      aria-controls="landing-mobile-menu"
    >
      <div className="w-[18px] h-3.5 relative flex flex-col justify-between">
        <span
          className={cn(
            'block w-full h-[2px] bg-[#a1a1aa] rounded-[1px] transition-all duration-300 origin-center',
            isOpen && 'landing-nav__hamburger-line--open-top'
          )}
        />
        <span
          className={cn(
            'block w-full h-[2px] bg-[#a1a1aa] rounded-[1px] transition-all duration-300 origin-center',
            isOpen && 'landing-nav__hamburger-line--open-mid'
          )}
        />
        <span
          className={cn(
            'block w-full h-[2px] bg-[#a1a1aa] rounded-[1px] transition-all duration-300 origin-center',
            isOpen && 'landing-nav__hamburger-line--open-bot'
          )}
        />
      </div>
    </button>
  );
}

/** Mobile drawer nav */
function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[90] bg-black/60 backdrop-blur-[4px] transition-all duration-300',
          isOpen
            ? 'landing-nav__drawer-backdrop--visible'
            : 'landing-nav__drawer-backdrop--hidden'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        id="landing-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'fixed top-[72px] left-0 right-0 bottom-0 z-[95] bg-[#080c10]/95 border-t border-[rgba(0,255,136,0.15)] flex flex-col overflow-y-auto transition-all duration-300 lg:hidden',
          isOpen ? 'landing-nav__drawer--open' : 'landing-nav__drawer--closed'
        )}
        style={{ padding: '32px 24px', gap: '32px' }}
      >
        {/* Grid background effect inside drawer */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.3)_30%,transparent_100%)]" aria-hidden="true" />

        <nav aria-label="Mobile navigation">
          <ul className="list-none m-0 p-0 flex flex-col gap-1 relative z-10" role="list">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.href}
                className={cn(
                  'opacity-0 -translate-x-3 transition-all duration-300',
                  isOpen && 'opacity-100 translate-x-0'
                )}
                style={{ transitionDelay: isOpen ? `${80 + i * 50}ms` : '0ms' }}
              >
                <a
                  href={link.href}
                  className="flex items-center gap-3 p-4 text-[#a1a1aa] text-base font-medium no-underline border border-transparent rounded-[10px] hover:text-[#fafafa] hover:bg-neon-green-subtle hover:border-[rgba(0,255,136,0.1)] focus-visible:outline-2 focus-visible:outline-neon-green focus-visible:outline-offset-2 transition-all group"
                  onClick={onClose}
                >
                  <span className="w-[3px] h-[18px] rounded-[2px] bg-gradient-to-b from-neon-green to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true" />
                  {link.label}
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-200" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer CTAs */}
        <div className="flex flex-col gap-3 pt-3 border-t border-[rgba(0,255,136,0.08)] relative z-10">
          <a
            href="https://github.com/gymgit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3.5 text-[#a1a1aa] text-sm font-medium no-underline border border-[rgba(63,63,70,0.6)] rounded-[10px] bg-[rgba(24,24,27,0.5)] hover:text-[#fafafa] hover:border-[rgba(161,161,170,0.3)] hover:bg-[rgba(39,39,42,0.6)] transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-neon-green"
            onClick={onClose}
          >
            <Star className="w-4 h-4" />
            Star on GitHub
          </a>
          <button
            className="flex items-center justify-center gap-2 p-3.5 text-[#080c10] text-sm font-semibold no-underline rounded-[10px] bg-gradient-to-r from-neon-green to-[#00e077] hover:shadow-[0_0_20px_var(--neon-green-glow)] focus-visible:outline-2 focus-visible:outline-neon-cyan outline-none transition-all duration-200"
            onClick={() => {
              onClose();
              import("@/lib/appLauncher").then(
                ({ openMobileApp }) => {
                  openMobileApp();
                }
              );
            }}
          >
            Launch App
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Main Navbar Component
   ───────────────────────────────────────────── */
export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-[72px] bg-[rgba(8,12,16,0.72)] backdrop-blur-md border-b border-[rgba(0,255,136,0.08)] transition-all duration-300',
        scrolled && 'bg-[rgba(8,12,16,0.92)] border-b-[rgba(0,255,136,0.15)] shadow-[0_1px_0_0_rgba(0,255,136,0.06),0_8px_32px_-8px_rgba(0,0,0,0.5)]'
      )}
      role="banner"
    >
      {/* Top neon line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green via-neon-cyan via-neon-green to-transparent opacity-50 transition-opacity duration-300",
        scrolled && "opacity-80"
      )} aria-hidden="true" />

      <div className="max-w-nav-max-width mx-auto px-6 lg:px-10 h-full flex items-center justify-between gap-6">
        {/* Left — Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-[10px] no-underline outline-none focus-visible:outline-2 focus-visible:outline-neon-green focus-visible:outline-offset-4 focus-visible:rounded-lg group" aria-label="Gym Git home">
            <LogoMark />
            <Wordmark />
          </Link>
        </div>

        {/* Center — Links (desktop) */}
        <DesktopNavLinks />

        {/* Right — Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <GitHubStarLink />
          <LaunchAppButton />
          <MobileMenuToggle
            isOpen={mobileOpen}
            onToggle={() => setMobileOpen((prev) => !prev)}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}