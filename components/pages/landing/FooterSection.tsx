'use client';

'use client';

import './FooterSection.css';
import React, { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, ArrowRight, CheckCircle2 } from 'lucide-react';

/* ─────────────────────────────────────────────
   Brand SVG Icons
   ───────────────────────────────────────────── */
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
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Data Links
   ───────────────────────────────────────────── */
const PRODUCT_LINKS = [
  { name: 'Features', href: '#features' },
  { name: 'Streak Heatmap', href: '#streaks' },
  { name: 'Analytics & Insights', href: '#analytics' },
  { name: 'Workout Builder', href: '#builder' },
  { name: 'Mobile App', href: '#mobile' },
  { name: 'Changelog', href: '#changelog', isNew: true },
];

const RESOURCE_LINKS = [
  { name: 'Documentation', href: '#docs' },
  { name: 'API Reference', href: '#api' },
  { name: 'Community Hub', href: '#community' },
  { name: 'Workout Guides', href: '#guides' },
  { name: 'System Status', href: '#status' },
];

const COMPANY_LINKS = [
  { name: 'About Gym-Git', href: '#about' },
  { name: 'Careers', href: '#careers', badge: 'Hiring' },
  { name: 'Engineering Blog', href: '#blog' },
  { name: 'Press Kit', href: '#press' },
  { name: 'Contact', href: '#contact' },
];

const LEGAL_LINKS = [
  { name: 'Privacy Policy', href: '#privacy' },
  { name: 'Terms of Service', href: '#terms' },
  { name: 'Security', href: '#security' },
  { name: 'Cookie Policy', href: '#cookies' },
];

export default function FooterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative bg-[#04070a]/70 backdrop-blur-md border-t border-[rgba(39,39,42,0.6)] py-20 pb-8 overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="landing-footer__grid-bg" aria-hidden="true" />

      <div className="max-w-nav-max-width mx-auto px-6 lg:px-10">
        {/* Top Section: Brand + Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_repeat(3,1fr)_2fr] gap-10 lg:gap-8 mb-16 text-left">

          {/* Brand Info Column */}
          <div className="flex flex-col gap-5">
            <Link href="/landing" className="inline-flex items-center gap-2.5 no-underline">
              <div className="w-9 h-9 rounded-lg bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center shadow-[0_0_12px_rgba(0,255,136,0.15)]">
                <Dumbbell className="w-5 h-5 text-neon-green" />
              </div>
              <span className="text-xl font-black tracking-tight text-[#fafafa]">
                GYM<span className="text-neon-green">-</span>GIT
              </span>
            </Link>

            <p className="text-[13.5px] leading-relaxed text-[#71717a] m-0">
              Track your fitness like a developer. Commit to progress, build unbreakable streaks, and level up your strength every single day.
            </p>

            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(0,255,136,0.15)] bg-[rgba(0,255,136,0.04)] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_#00ff88] animate-[badge-pulse_2s_ease-in-out_infinite]" aria-hidden="true" />
              <span className="text-[10px] font-bold text-neon-green uppercase tracking-wide">All Systems Operational</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-[rgba(63,63,70,0.5)] bg-[rgba(24,24,27,0.4)] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[rgba(0,255,136,0.2)] hover:bg-[rgba(39,39,42,0.6)] flex items-center justify-center transition-all cursor-pointer" aria-label="GitHub">
                <GithubIcon className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-[rgba(63,63,70,0.5)] bg-[rgba(24,24,27,0.4)] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[rgba(0,255,136,0.2)] hover:bg-[rgba(39,39,42,0.6)] flex items-center justify-center transition-all cursor-pointer" aria-label="Twitter">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-[rgba(63,63,70,0.5)] bg-[rgba(24,24,27,0.4)] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[rgba(0,255,136,0.2)] hover:bg-[rgba(39,39,42,0.6)] flex items-center justify-center transition-all cursor-pointer" aria-label="Discord">
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-[rgba(63,63,70,0.5)] bg-[rgba(24,24,27,0.4)] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[rgba(0,255,136,0.2)] hover:bg-[rgba(39,39,42,0.6)] flex items-center justify-center transition-all cursor-pointer" aria-label="YouTube">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1: Product */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-bold tracking-wider text-[#fafafa] uppercase m-0">Product</h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center gap-2 text-[13.5px] text-[#a1a1aa] no-underline hover:text-[#fafafa] transition-all">
                    <span>{link.name}</span>
                    {link.isNew && <span className="px-1.5 py-0.5 rounded-full bg-neon-green-subtle/20 border border-neon-green/30 text-[9px] font-bold text-neon-green">v2.0</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-bold tracking-wider text-[#fafafa] uppercase m-0">Resources</h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center gap-2 text-[13.5px] text-[#a1a1aa] no-underline hover:text-[#fafafa] transition-all">
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3: Company */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-bold tracking-wider text-[#fafafa] uppercase m-0">Company</h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center gap-2 text-[13.5px] text-[#a1a1aa] no-underline hover:text-[#fafafa] transition-all">
                    <span>{link.name}</span>
                    {link.badge && <span className="px-1.5 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-[9px] font-bold text-[#a855f7]">{link.badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-bold tracking-wider text-[#fafafa] uppercase m-0">Stay Updated</h3>
            <p className="text-[13px] leading-relaxed text-[#71717a] m-0">
              Subscribe for release notes, lifting guides, and developer fitness hacks.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 w-full max-w-[280px]">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter.your@email.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[rgba(63,63,70,0.6)] bg-[rgba(24,24,27,0.4)] text-[13.5px] text-[#fafafa] placeholder-zinc-600 focus:outline-none focus:border-neon-green transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md bg-[rgba(39,39,42,0.6)] text-[#a1a1aa] hover:text-white border-none cursor-pointer transition-all" aria-label="Subscribe">
                  {subscribed ? (
                    <CheckCircle2 className="w-4 h-4 text-neon-green" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
              {subscribed && (
                <span className="text-[11px] font-semibold text-neon-green mt-1">
                  ✓ Subscribed! Welcome to the squad.
                </span>
              )}
            </form>
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[rgba(63,63,70,0.3)] my-8" aria-hidden="true" />

        {/* Bottom Bar: Copyright + Legal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[12.5px] text-[#71717a] font-medium text-center md:text-left">
            © {new Date().getFullYear()} Gym-Git, Inc. All rights reserved. Crafted for lifters worldwide.
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.name} href={link.href} className="text-[12px] text-[#71717a] no-underline hover:text-[#fafafa] transition-all">
                {link.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
