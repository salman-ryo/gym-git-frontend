import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck, Lock, EyeOff, Database, Bell, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read our privacy policy to understand how Gym-Git collects, uses, and safeguards your workout and account data. Your fitness privacy is our priority.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Gym-Git',
    description:
      'Learn how Gym-Git protects your workout telemetry, authentication credentials, and personal information.',
    url: '/privacy',
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'August 25, 2026';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      <main className="py-16 px-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-neon-green transition-colors inline-flex items-center gap-1 mb-6"
          >
            &larr; Back to Gym-Git Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neon-green/20 bg-neon-green/10 text-neon-green text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Privacy &amp; Data Security
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-400">
            Last updated: <span className="text-zinc-300 font-medium">{lastUpdated}</span>
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="p-6 rounded-2xl border border-neon-green/25 bg-gradient-to-br from-neon-green/10 via-zinc-900/60 to-zinc-900/40 backdrop-blur-md mb-10">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-neon-green" /> Our Core Privacy Commitment
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Gym-Git is built on the philosophy that <strong>your workout data belongs to you</strong>. We do not sell your personal information, workout telemetry, or biometric logs to data brokers or third-party advertisers.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 text-zinc-300 text-sm md:text-base leading-relaxed">
          <section className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-400" /> 1. Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Account Information:</strong> When you register via email or OAuth providers (e.g., Google or GitHub), we collect your name, email address, and avatar URL.
              </li>
              <li>
                <strong className="text-zinc-200">Workout &amp; Attendance Logs:</strong> Workout dates, session duration, exercises performed, weight/reps logged, and attendance records used to calculate contribution grids and streaks.
              </li>
              <li>
                <strong className="text-zinc-200">Gamification Telemetry:</strong> Power Level XP, badges unlocked, inventory items (shields, freeze streaks), and weekly targets.
              </li>
              <li>
                <strong className="text-zinc-200">Technical Data:</strong> Browser user-agent and device OS to optimize mobile app launch triggers and responsive rendering.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-cyan-400" /> 2. How We Use Your Data
            </h2>
            <p className="text-zinc-400 mb-3">
              We process your information exclusively for the following operational purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>Rendering your annual GitHub-style contribution heatmap and calculating active streaks.</li>
              <li>Providing customized workout analytics, power level rankings, and badge rewards.</li>
              <li>Authenticating session tokens securely using Supabase Auth.</li>
              <li>Delivering critical service notifications and account recovery assistance.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" /> 3. Data Storage &amp; Third-Party Services
            </h2>
            <p className="text-zinc-400 mb-3">
              Gym-Git utilizes industry-standard security and cloud infrastructure providers:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Supabase &amp; PostgreSQL:</strong> Secure database storage with encrypted transmission (TLS/SSL) and row-level security (RLS).
              </li>
              <li>
                <strong className="text-zinc-200">OAuth Providers:</strong> Optional single sign-on via Google and GitHub with least-privilege permission scopes.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" /> 4. Your Rights &amp; Data Deletion
            </h2>
            <p className="text-zinc-400 mb-3">
              You retain full control over your data. You may export your workout records or request complete deletion of your account and all associated logs at any time by contacting our support team or visiting account settings.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-400" /> 5. Contact Us
            </h2>
            <p className="text-zinc-400">
              If you have any questions or privacy inquiries regarding Gym-Git, please contact us at{' '}
              <a href="mailto:support@gymgit.com" className="text-neon-green hover:underline">
                support@gymgit.com
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
