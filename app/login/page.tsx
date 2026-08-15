'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { LandingBackground } from '@/components/pages/landing';

export default function LoginPage() {
  const { user, login, signup, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    if (mode === 'signup' && !name) {
      setError('Please enter your full name.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || `${mode === 'signup' ? 'Sign up' : 'Login'} failed. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google Sign-In failed.');
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a0e] text-[#fafafa] flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-neon-green/20 selection:text-neon-green">
      {/* ── Animated Cyberpunk Background from Landing Page ── */}
      <LandingBackground />

      {/* ── Aesthetic Background Watermarks (Preserved & Enhanced) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
        {/* Large Dumbbell - Bottom Left */}
        <div className="absolute -bottom-32 -left-32 w-[550px] h-[550px] opacity-15 -rotate-[30deg] mix-blend-screen filter drop-shadow-[0_0_40px_rgba(0,255,136,0.15)]">
          <Image
            src="/images/ggdumbell.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 550px"
            className="object-contain"
            priority
          />
        </div>

        {/* Large Git Tree - Top Right */}
        <div className="absolute -top-28 -right-20 w-[650px] h-[650px] opacity-15 rotate-[15deg] mix-blend-screen filter drop-shadow-[0_0_40px_rgba(34,211,238,0.15)]">
          <Image
            src="/images/gggit.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 650px"
            className="object-contain"
            priority
          />
        </div>

        {/* Small Dumbbell - Top Left */}
        <div className="absolute top-12 left-12 w-[180px] h-[180px] opacity-10 rotate-[45deg] mix-blend-screen hidden md:block">
          <Image
            src="/images/ggdumbell.webp"
            alt=""
            fill
            sizes="180px"
            className="object-contain"
          />
        </div>

        {/* Small Git Tree - Bottom Right */}
        <div className="absolute bottom-16 right-12 w-[260px] h-[260px] opacity-10 -rotate-[20deg] mix-blend-screen hidden md:block">
          <Image
            src="/images/gggit.webp"
            alt=""
            fill
            sizes="260px"
            className="object-contain"
          />
        </div>
      </div>

      {/* ── Top Navigation Bar: Quick Return to Landing ── */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 relative z-10 px-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#a1a1aa] hover:text-[#00ff88] transition-colors group no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Landing</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neon-green/15 bg-neon-green/5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_#00ff88] animate-[badge-pulse_2s_ease-in-out_infinite]" />
          <span className="text-[10.5px] font-bold tracking-wider text-neon-green uppercase">Riyou Kaishi</span>
        </div>
      </div>

      {/* ── Main Glassmorphic Auth Card ── */}
      <div className="w-full max-w-md bg-[#080c10]/85 border border-[rgba(0,255,136,0.15)] backdrop-blur-2xl rounded-2xl p-7 sm:p-8 shadow-[0_0_50px_-10px_rgba(0,255,136,0.12),0_20px_40px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
        {/* Top Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-green via-neon-cyan to-transparent opacity-80" />

        {/* Ambient Corner Light Orbs */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-neon-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-neon-purple/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6 relative">
          <Link href="/" className="group mb-3 relative flex items-center justify-center">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-neon-green/30 via-neon-cyan/20 to-neon-purple/30 group-hover:from-neon-green/60 group-hover:to-neon-cyan/60 transition-all duration-300 shadow-[0_0_25px_rgba(0,255,136,0.2)]">
              <div className="w-full h-full bg-[#080c10] rounded-[14px] flex items-center justify-center overflow-hidden">
                <Image
                  src="/web-app-manifest-192x192.png"
                  alt="Gym-Git Logo"
                  width={76}
                  height={76}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xl font-black tracking-wider text-[#e4e4e7]">GYM</span>
            <span className="text-xl font-black tracking-wider bg-gradient-to-br from-neon-green to-neon-cyan bg-clip-text text-transparent">
              GIT
            </span>
          </div>

          <p className="text-[#94a3b8] text-xs max-w-[280px]">
            Commit to your fitness. Track your streak like code.
          </p>
        </div>

        {/* Sign In / Sign Up Mode Switcher */}
        <div className="flex rounded-xl bg-[#05080c]/90 p-1 mb-5 border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${mode === 'signin'
              ? 'bg-gradient-to-r from-neon-green to-[#00e077] text-[#060a0e] shadow-[0_0_15px_rgba(0,255,136,0.35)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${mode === 'signup'
              ? 'bg-gradient-to-r from-neon-green to-[#00e077] text-[#060a0e] shadow-[0_0_15px_rgba(0,255,136,0.35)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create Account
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
            <span>{error}</span>
          </div>
        )}

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleSubmitting || submitting}
          className="w-full bg-[rgba(24,24,27,0.5)] hover:bg-[rgba(39,39,42,0.6)] text-[#e4e4e7] border border-[rgba(63,63,70,0.6)] hover:border-[rgba(0,255,136,0.3)] hover:text-[#fafafa] hover:shadow-[0_0_20px_rgba(0,255,136,0.12)] rounded-xl py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-50 mb-5 group cursor-pointer"
        >
          {googleSubmitting ? (
            <div className="w-4 h-4 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{googleSubmitting ? 'Authenticating...' : 'Continue with Google'}</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-zinc-800/80 w-full" />
          <span className="bg-[#080c10] px-3 text-[11px] text-[#71717a] uppercase font-medium tracking-wider">
            Or {mode === 'signup' ? 'register' : 'sign in'} with email
          </span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <UserIcon className="w-4 h-4 text-zinc-500 group-focus-within:text-neon-green transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Developer"
                  className="w-full bg-[#05080c]/80 border border-zinc-800/90 focus:border-neon-green focus:ring-1 focus:ring-neon-green/40 focus:bg-[#080d14] rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="w-4 h-4 text-zinc-500 group-focus-within:text-neon-green transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#05080c]/80 border border-zinc-800/90 focus:border-neon-green focus:ring-1 focus:ring-neon-green/40 focus:bg-[#080d14] rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative group">
              <Lock className="w-4 h-4 text-zinc-500 group-focus-within:text-neon-green transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#05080c]/80 border border-zinc-800/90 focus:border-neon-green focus:ring-1 focus:ring-neon-green/40 focus:bg-[#080d14] rounded-xl py-2.5 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-neon-green focus:outline-none transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || googleSubmitting}
            className="w-full relative inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-extrabold text-[#080c10] rounded-xl bg-gradient-to-r from-neon-green via-[#00e077] to-neon-cyan shadow-[0_0_20px_rgba(0,255,136,0.3),0_6px_16px_-4px_rgba(0,255,136,0.2)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5),0_8px_24px_-4px_rgba(0,255,136,0.3)] hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 overflow-hidden transition-all duration-200 disabled:opacity-50 mt-5 group cursor-pointer border-none outline-none"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-[#080c10] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="relative z-10">
                  {mode === 'signup' ? 'Create Account & Start' : 'Sign In to Dashboard'}
                </span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-[120%] group-hover:animate-[shimmer-effect_0.8s_ease_forwards]"
                  aria-hidden="true"
                />
              </>
            )}
          </button>
        </form>

        {/* Security / Trust Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#71717a] font-medium mt-6 pt-4 border-t border-zinc-800/60">
          <ShieldCheck className="w-3.5 h-3.5 text-neon-green" />
          <span>Encrypted session &bull; Supabase Auth</span>
        </div>
      </div>
    </div>
  );
}