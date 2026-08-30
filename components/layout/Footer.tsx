'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { socialLinks, footerLinks } from '@/lib/links';

/* Brand SVG Icons */
function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on auth, login, and admin screens
  if (
    pathname === '/login' ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/auth') ||
    pathname === '/admin' ||
    pathname?.startsWith('/admin')
  ) {
    return null;
  }

  return (
    <footer className="relative z-20 bg-glass-bg border-t border-glass-border py-8 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left Side: Brand & description */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link href="/" className="flex items-center gap-3 no-underline group cursor-pointer">
            <div className="rounded-xl">
              <Image
                src="/web-app-manifest-512x512.png"
                alt="Gym-Git Logo"
                width={40}
                height={40}
                className="w-10 h-10 transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-md font-black tracking-tight bg-gradient-to-r from-neon-green via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                  Gym-Git
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-none">GitHub-style Fitness Tracker</p>
            </div>
          </Link>
          <p className="text-xs text-zinc-400 max-w-sm text-center md:text-left leading-relaxed">
            Track your fitness like a developer. Commit to progress, build unbreakable streaks, and level up your strength.
          </p>
        </div>

        {/* Right Side: Socials & copyright info */}
        <div className="flex flex-col items-center md:items-end gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-neon-green/30 hover:bg-neon-green/10 flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5" aria-label="GitHub">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-neon-green/30 hover:bg-neon-green/10 flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5" aria-label="LinkedIn">
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>

          <div className="text-center md:text-right flex flex-col items-center md:items-end gap-1">
            <span className="text-xs text-zinc-500">
              Gym-Git &copy; {new Date().getFullYear()} — Dynamic Workout Planning
            </span>
            <div className="flex items-center flex-wrap justify-center md:justify-end gap-2 text-[10px] text-zinc-500">
              <Link
                href={footerLinks.about}
                className="hover:text-zinc-300 transition-colors underline underline-offset-2"
              >
                About
              </Link>
              <span>•</span>
              <Link
                href={footerLinks.privacy}
                className="hover:text-zinc-300 transition-colors underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                href={footerLinks.terms}
                className="hover:text-zinc-300 transition-colors underline underline-offset-2"
              >
                Terms of Service
              </Link>
              <span>•</span>
              <Link
                href={footerLinks.credits}
                className="hover:text-zinc-300 transition-colors underline underline-offset-2"
              >
                Credits
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}