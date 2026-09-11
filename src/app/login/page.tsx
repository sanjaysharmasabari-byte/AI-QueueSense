'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueue } from '@/context/QueueContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Scan, Lock, Mail, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useQueue();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('student');
    router.push('/student/dashboard');
  };

  const handleDemoStudent = () => {
    setRole('student');
    router.push('/student/dashboard');
  };

  const handleDemoStaff = () => {
    setRole('staff');
    router.push('/staff/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A11] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-[1px] shadow-lg shadow-teal-500/20">
              <div className="w-full h-full bg-slate-100 dark:bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Scan className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              AI QueueSense
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Sign in to your account</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Real-time campus queue intelligence platform
          </p>
        </div>

        {/* Card Form */}
        <GlassCard glow="teal" className="p-6 sm:p-8">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-white/10 bg-slate-950 text-teal-500 focus:ring-0"
                />
                Remember me
              </label>
              <a href="#" className="text-teal-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs hover:shadow-lg hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Triggers */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <p className="text-[11px] text-center text-slate-400 font-semibold uppercase tracking-wider">
              Quick Prototype Access
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoStudent}
                className="py-2.5 px-3 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold hover:bg-teal-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Demo Student
              </button>

              <button
                type="button"
                onClick={handleDemoStaff}
                className="py-2.5 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Demo Staff
              </button>
            </div>
          </div>
        </GlassCard>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-teal-400 font-semibold hover:underline">
            Register for access
          </Link>
        </p>
      </div>
    </div>
  );
}
