'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Dumbbell, Lock, Mail, User as UserIcon, ArrowRight, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

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
      router.push('/');
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
      router.push('/');
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden z-0">

      {/* Aesthetic Background Watermarks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Large Dumbbell - Bottom Left */}
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] opacity-20 -rotate-[30deg] mix-blend-screen">
          <Image
            src="/images/ggdumbell.webp"
            alt="Dumbbell Background"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Large Git Tree - Top Right */}
        <div className="absolute -top-32 -right-20 w-[700px] h-[700px] opacity-20 rotate-[15deg] mix-blend-screen">
          <Image
            src="/images/gggit.webp"
            alt="Git Tree Background"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Small Dumbbell - Top Left */}
        <div className="absolute top-10 left-10 w-[200px] h-[200px] opacity-10 rotate-[45deg] mix-blend-screen hidden md:block">
          <Image
            src="/images/ggdumbell.webp"
            alt="Dumbbell Background Small"
            fill
            className="object-contain"
          />
        </div>

        {/* Small Git Tree - Bottom Right */}
        <div className="absolute bottom-20 right-10 w-[300px] h-[300px] opacity-10 -rotate-[20deg] mix-blend-screen hidden md:block">
          <Image
            src="/images/gggit.webp"
            alt="Git Tree Background Small"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Background Glow Accents - Matched to Logo (Emerald and Purple) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <Image
            src="/web-app-manifest-512x512.png"
            alt="Gym-Git Logo"
            width={300}
            height={300}
            className='size-28 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.15)]'
          />
          <p className="text-zinc-400 text-sm mt-3">
            Commit to your fitness. Track your streak like code.
          </p>
        </div>

        {/* Sign In / Sign Up Mode Switcher */}
        <div className="flex rounded-xl bg-zinc-950/60 p-1 mb-6 border border-zinc-800/80">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'signin'
              ? 'bg-cyan-500 text-zinc-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] ring-1 ring-cyan-400'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
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
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'signup'
              ? 'bg-cyan-500 text-zinc-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] ring-1 ring-cyan-400'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleSubmitting || submitting}
          className="w-full bg-zinc-800/60 hover:bg-zinc-700/80 text-white border border-zinc-700/60 rounded-xl py-3 px-4 text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg disabled:opacity-50 mb-6 group"
        >
          {googleSubmitting ? (
            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-zinc-800 w-full" />
          <span className="bg-zinc-900 px-3 text-xs text-zinc-500 uppercase font-medium">
            Or {mode === 'signup' ? 'register' : 'sign in'} with email
          </span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Developer"
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 rounded-xl py-2.5 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || googleSubmitting}
            className="w-full bg-gradient-to-r from-emerald-700 to-purple-700 hover:from-emerald-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 mt-6"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signup' ? 'Create Account & Start' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}