'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueue } from '@/context/QueueContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Scan, User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setRole } = useQueue();
  const [selectedRole, setSelectedRole] = useState<'student' | 'staff'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    if (selectedRole === 'staff') {
      router.push('/staff/dashboard');
    } else {
      router.push('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] flex items-center justify-center p-4 relative overflow-hidden bg-hero-gradient">
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Scan className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">
              AI QueueSense
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-200">Create Campus Account</h2>
          <p className="text-xs text-slate-400">
            Access live queue predictions and operational analytics
          </p>
        </div>

        <GlassCard glow="cyan" className="p-6 sm:p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`py-2 text-xs font-bold rounded-md transition-all ${
                    selectedRole === 'student'
                      ? 'bg-teal-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('staff')}
                  className={`py-2 text-xs font-bold rounded-md transition-all ${
                    selectedRole === 'staff'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Staff / Admin
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Campus Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.m@campus.edu"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
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
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Complete Registration
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="text-teal-400 font-semibold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
