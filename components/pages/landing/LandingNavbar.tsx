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
    <div className="landing-nav__logo-mark" aria-hidden="true">
      <Image
        src="/web-app-manifest-192x192.png"
        alt=""
        width={192}
        height={192}
        className="landing-nav__logo-img"
        priority
      />
      {/* Neon glow ring behind the logo */}
      <div className="landing-nav__logo-glow" />
    </div>
  );
}

/** Brand wordmark */
function Wordmark() {
  return (
    <span className="landing-nav__wordmark" aria-label="Gym Git">
      <span className="landing-nav__wordmark-gym">GYM</span>{' '}
      <span className="landing-nav__wordmark-git">GIT</span>
    </span>
  );
}

/** Desktop nav links */
function DesktopNavLinks() {
  return (
    <nav className="landing-nav__desktop-links" aria-label="Main navigation">
      <ul className="landing-nav__link-list" role="list">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="landing-nav__link"
            >
              <span className="landing-nav__link-text">{link.label}</span>
              <span className="landing-nav__link-glow" aria-hidden="true" />
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
      className="landing-nav__github-link"
      aria-label="Star Gym Git on GitHub"
    >
      <Star className="landing-nav__github-icon" />
      <span className="landing-nav__github-text">Star on GitHub</span>
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
      className="landing-nav__cta"
    >
      <span className="landing-nav__cta-text">
        Login
      </span>

      <ChevronRight className="landing-nav__cta-arrow" />

      <span
        className="landing-nav__cta-glow"
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
      className="landing-nav__mobile-toggle"
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
      aria-controls="landing-mobile-menu"
    >
      <div className="landing-nav__hamburger-box">
        <span
          className={cn(
            'landing-nav__hamburger-line landing-nav__hamburger-line--top',
            isOpen && 'landing-nav__hamburger-line--open-top'
          )}
        />
        <span
          className={cn(
            'landing-nav__hamburger-line landing-nav__hamburger-line--mid',
            isOpen && 'landing-nav__hamburger-line--open-mid'
          )}
        />
        <span
          className={cn(
            'landing-nav__hamburger-line landing-nav__hamburger-line--bot',
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
          'landing-nav__drawer-backdrop',
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
          'landing-nav__drawer',
          isOpen ? 'landing-nav__drawer--open' : 'landing-nav__drawer--closed'
        )}
      >
        {/* Grid background effect inside drawer */}
        <div className="landing-nav__drawer-grid" aria-hidden="true" />

        <nav aria-label="Mobile navigation">
          <ul className="landing-nav__drawer-list" role="list">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.href}
                className="landing-nav__drawer-item"
                style={{ transitionDelay: isOpen ? `${80 + i * 50}ms` : '0ms' }}
              >
                <a
                  href={link.href}
                  className="landing-nav__drawer-link"
                  onClick={onClose}
                >
                  <span className="landing-nav__drawer-link-accent" aria-hidden="true" />
                  {link.label}
                  <ChevronRight className="landing-nav__drawer-link-arrow" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer CTAs */}
        <div className="landing-nav__drawer-ctas">
          <a
            href="https://github.com/gymgit"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-nav__drawer-github"
            onClick={onClose}
          >
            <Star className="w-4 h-4" />
            Star on GitHub
          </a>
          <button
            className="landing-nav__drawer-launch"
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
        'landing-nav',
        scrolled && 'landing-nav--scrolled'
      )}
      role="banner"
    >
      {/* Top neon line */}
      <div className="landing-nav__top-line" aria-hidden="true" />

      <div className="landing-nav__container">
        {/* Left — Logo */}
        <div className="landing-nav__brand">
          <Link href="/" className="landing-nav__brand-link" aria-label="Gym Git home">
            <LogoMark />
            <Wordmark />
          </Link>
        </div>

        {/* Center — Links (desktop) */}
        <DesktopNavLinks />

        {/* Right — Actions */}
        <div className="landing-nav__actions">
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