'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQueue } from '@/context/QueueContext';
import {
  Scan,
  UserCheck,
  LayoutDashboard,
  Shield,
  MapPin,
  BarChart2,
  Cpu,
  Menu,
  X,
  ChevronRight,
  LogIn,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { role, setRole } = useQueue();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Features', href: '/#features' },
    { name: 'Student View', href: '/student/dashboard' },
    { name: 'Staff Control', href: '/staff/dashboard' },
    { name: 'Campus Map', href: '/map' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Architecture', href: '/architecture' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-[1px] shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Scan className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-teal-300 transition-colors">
                AI QueueSense
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 tracking-wide hidden sm:block">
              Smarter Queues. Shorter Waits.
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-teal-300 bg-teal-500/10 border border-teal-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Role Switcher */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Demo Role Switcher */}
          <div className="flex items-center bg-slate-900 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setRole('student')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                role === 'student'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole('staff')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                role === 'staff'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Staff
            </button>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 transition-all"
          >
            <LogIn className="w-3.5 h-3.5 text-teal-400" />
            Sign In
          </Link>

          <Link
            href="/student/dashboard"
            className="relative group overflow-hidden rounded-lg p-[1px] focus:outline-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 transition-all duration-300 group-hover:opacity-90" />
            <span className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] bg-slate-950 text-xs font-semibold text-teal-300 group-hover:bg-slate-950/80 transition-all">
              Live Dashboard
              <ChevronRight className="w-3.5 h-3.5 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Mobile menu trigger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950 border-b border-white/10 px-4 pt-2 pb-6 space-y-3"
          >
            <div className="grid grid-cols-2 gap-2 pt-2 pb-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-teal-300 bg-slate-900/80 border border-white/5 rounded-lg flex items-center justify-between"
                >
                  {link.name}
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-white/10">
                <span className="text-xs text-slate-400 font-medium">Switch Role:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setRole('student');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 text-xs rounded-md ${
                      role === 'student'
                        ? 'bg-teal-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    onClick={() => {
                      setRole('staff');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 text-xs rounded-md ${
                      role === 'staff'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Staff
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-xs font-semibold rounded-lg bg-slate-900 border border-white/10 text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-xs font-semibold rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow"
                >
                  Launch App
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
