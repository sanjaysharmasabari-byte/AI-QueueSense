'use client';

import React from 'react';
import Link from 'next/link';
import { Scan, ShieldCheck, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950 text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Scan className="w-4 h-4 text-teal-400" />
              </div>
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              AI QueueSense
            </span>
          </div>
          <p className="text-slate-300 font-medium">"Smarter Queues. Shorter Waits."</p>
          <p className="text-slate-400 text-[11px] leading-relaxed max-w-sm">
            AI QueueSense uses real-time computer vision crowd counting, queue density analysis, and AI-assisted wait time prediction to streamline campus operations and student movement.
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-white/10 text-[10px] text-teal-300">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Privacy-First Architecture • Zero Biometric Identity Tracking
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">
            Product & Demos
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/student/dashboard" className="hover:text-teal-300 transition-colors">
                Student Dashboard
              </Link>
            </li>
            <li>
              <Link href="/staff/dashboard" className="hover:text-teal-300 transition-colors">
                Staff Command Center
              </Link>
            </li>
            <li>
              <Link href="/camera" className="hover:text-teal-300 transition-colors">
                Camera Vision Stream
              </Link>
            </li>
            <li>
              <Link href="/map" className="hover:text-teal-300 transition-colors">
                Interactive Campus Map
              </Link>
            </li>
          </ul>
        </div>

        {/* Analytics & Architecture */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">
            Platform Specs
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/analytics" className="hover:text-teal-300 transition-colors">
                Queue Analytics
              </Link>
            </li>
            <li>
              <Link href="/architecture" className="hover:text-teal-300 transition-colors">
                System Pipeline
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-teal-300 transition-colors">
                Privacy Hub
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:text-teal-300 transition-colors">
                Admin Thresholds
              </Link>
            </li>
          </ul>
        </div>

        {/* Disclaimer / System Info */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">
            System Notice
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            AI QueueSense is a prototype demonstrating AI-assisted queue intelligence using simulated data.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 text-[10px] text-slate-400">
            <span className="text-teal-300 font-semibold">Engine Version:</span> v2.4-simulated
            <br />
            <span className="text-teal-300 font-semibold">Status:</span> All Systems Operational
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <p>© {new Date().getFullYear()} AI QueueSense. All rights reserved.</p>
        <p className="text-center sm:text-right text-slate-400">
          Built with Next.js 15, TypeScript, Tailwind CSS, & Framer Motion.
        </p>
      </div>
    </footer>
  );
};
