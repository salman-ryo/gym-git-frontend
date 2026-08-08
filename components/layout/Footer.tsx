'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* Brand SVG Icons */
function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TwitterIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-glass-bg border-t border-glass-border py-8 backdrop-blur-md">
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
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-neon-green/30 hover:bg-neon-green/10 flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5" aria-label="GitHub">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-neon-green/30 hover:bg-neon-green/10 flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5" aria-label="Twitter">
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-neon-green/30 hover:bg-neon-green/10 flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5" aria-label="Discord">
              <DiscordIcon className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-neon-green/30 hover:bg-neon-green/10 flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5" aria-label="YouTube">
              <YoutubeIcon className="w-4 h-4" />
            </a>
          </div>

          <div className="text-center md:text-right flex flex-col items-center md:items-end gap-1">
            <span className="text-xs text-zinc-500">Gym-Git &copy; {new Date().getFullYear()} — Dynamic Workout Planning</span>
            <span className="text-[10px] text-zinc-600">Built with Next.js, Go/Gin  &amp; Supabase </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
