import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FileText, ShieldAlert, CheckCircle, Scale, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Review the Gym-Git terms of service governing usage of the web application, workout tracking platform, and related APIs.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | Gym-Git',
    description:
      'Usage rules, account policies, and conditions for utilizing the Gym-Git workout platform.',
    url: '/terms',
  },
};

export default function TermsOfServicePage() {
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-teal-500/20 bg-teal-500/10 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5" /> Legal Agreement
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-zinc-400">
            Last updated: <span className="text-zinc-300 font-medium">{lastUpdated}</span>
          </p>
        </div>

        {/* Agreement summary */}
        <div className="p-6 rounded-2xl border border-teal-500/25 bg-gradient-to-br from-teal-500/10 via-zinc-900/60 to-zinc-900/40 backdrop-blur-md mb-10">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Scale className="w-5 h-5 text-teal-400" /> Welcome to Gym-Git
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            By accessing or using Gym-Git, you agree to be bound by these Terms of Service. If you do not agree to all of the terms, please do not use our services.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10 text-zinc-300 text-sm md:text-base leading-relaxed">
          <section className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-neon-green" /> 1. Eligibility &amp; Account Responsibility
            </h2>
            <p className="text-zinc-400 mb-3">
              You must be at least 13 years of age to use Gym-Git. You are responsible for safeguarding your login credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" /> 2. Health &amp; Physical Activity Disclaimer
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Gym-Git provides fitness tracking, gamified streaks, and volume analytics for informational and motivational purposes only. Gym-Git is not a medical provider. Always consult a qualified physician or health professional before starting any new training program, workout regimen, or dietary change.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-400" /> 3. Acceptable Use
            </h2>
            <p className="text-zinc-400 mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>Engage in automated scraping, denial of service, or abusive API calling patterns.</li>
              <li>Attempt to reverse-engineer, exploit vulnerabilities, or compromise user sessions.</li>
              <li>Use Gym-Git for any illegal purpose or in violation of local laws.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" /> 4. Intellectual Property
            </h2>
            <p className="text-zinc-400">
              All branding, logos, interactive charts, RPG gamification assets, UI designs, and codebase are the proprietary property of Gym-Git and its licensors. Third-party icons and vectors are credited on our{' '}
              <Link href="/credits" className="text-teal-300 hover:underline">
                Credits &amp; Attributions
              </Link>{' '}
              page.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-400" /> 5. Questions &amp; Inquiries
            </h2>
            <p className="text-zinc-400">
              For questions regarding these Terms, contact{' '}
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
