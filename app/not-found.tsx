import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, GitCommit, Home } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The requested Gym-Git page could not be found. Return to workout tracking.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center p-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-neon-green/15 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/15 blur-3xl rounded-full pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <GitCommit className="w-3.5 h-3.5" /> 404 Error: Commit Not Found
          </div>

          <h1 className="text-6xl font-black tracking-tight text-white mb-2 font-mono">
            404
          </h1>

          <h2 className="text-xl font-bold text-zinc-200 mb-3">
            Branch Or Commit Missing
          </h2>

          <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
            The page you are looking for has been rebased, deleted, or does not exist on this repository branch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-green to-teal-500 text-zinc-950 font-bold text-sm shadow-lg shadow-neon-green/20 hover:scale-[1.02] transition-transform"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:text-white hover:border-zinc-500 text-sm font-medium transition-colors"
            >
              Go to Login &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
