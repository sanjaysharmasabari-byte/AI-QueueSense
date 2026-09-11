'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { QueueStatusBadge } from '@/components/ui/QueueStatusBadge';
import {
  Scan,
  Users,
  Activity,
  Clock,
  Bell,
  Smartphone,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Camera,
  Layers,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const steps = [
    {
      num: '01',
      title: 'Camera',
      desc: 'USB/IP camera streams optical coverage over monitored counter regions.',
      icon: Camera,
    },
    {
      num: '02',
      title: 'Capture',
      desc: 'Video frame buffer samples streams at 3–5 FPS for low-latency batch processing.',
      icon: Layers,
    },
    {
      num: '03',
      title: 'Detect',
      desc: 'YOLOv8 computer vision detects anonymous human contours without facial capture.',
      icon: Scan,
    },
    {
      num: '04',
      title: 'Process',
      desc: 'Spatial queue boundary engine calculates real-time density and inflow velocity.',
      icon: Activity,
    },
    {
      num: '05',
      title: 'Predict',
      desc: 'AI regression algorithms forecast waiting times using historical shift patterns.',
      icon: Clock,
    },
    {
      num: '06',
      title: 'Display',
      desc: 'Aggregated analytics dispatch instantaneously to student and staff portals.',
      icon: LayoutDashboard,
    },
  ];

  const features = [
    {
      title: 'PEOPLE COUNTING',
      desc: 'Detect and count people inside monitored queue regions using high-precision computer vision.',
      icon: Users,
    },
    {
      title: 'QUEUE STATUS',
      desc: 'Classify queue congestion into Low, Medium, and High operational status levels in real time.',
      icon: Activity,
    },
    {
      title: 'WAIT PREDICTION',
      desc: 'Estimate expected waiting duration using current queue conditions and historical velocity trends.',
      icon: Clock,
    },
    {
      title: 'SMART ALERTS',
      desc: 'Notify campus personnel instantly when queue length crosses critical capacity thresholds.',
      icon: Bell,
    },
    {
      title: 'STUDENT VIEW',
      desc: 'Show real-time crowd levels, estimated wait times, and recommended low-congestion visit windows.',
      icon: Smartphone,
    },
    {
      title: 'STAFF VIEW',
      desc: 'Equip staff with live monitoring feeds, predictive forecasts, and proactive operational alerts.',
      icon: LayoutDashboard,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A11] text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                AI-POWERED CAMPUS INTELLIGENCE
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Smarter Queues. <br />
                <span className="bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-500 dark:from-teal-300 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Shorter Waits.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
                AI QueueSense uses real-time people counting, queue-density analysis, and waiting-time prediction to help campuses reduce congestion and improve service efficiency.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/student/dashboard"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm hover:shadow-lg hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2 group"
                >
                  View Live Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-white/15 text-slate-200 text-sm font-semibold hover:border-teal-500/40 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  Explore How It Works
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>100% Anonymous Detection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero Facial Recognition</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Low-Latency Frame Processing</span>
                </div>
              </div>
            </div>

            {/* Right Hero Dashboard Preview Widget */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <GlassCard glow="teal" className="p-5 border-teal-500/40 shadow-2xl bg-slate-950/90">
                  {/* Camera Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-teal-400" />
                      <span className="font-bold text-xs text-white">
                        CAM-01 • Canteen Entrance
                      </span>
                    </div>
                    <QueueStatusBadge status="Medium" size="sm" />
                  </div>

                  {/* Simulated Stream Preview Box */}
                  <div className="relative rounded-lg bg-slate-900 border border-white/10 p-3 aspect-[16/10] overflow-hidden flex flex-col justify-between mb-4">
                    <div className="absolute inset-0 bg-grid-pattern opacity-40" />

                    {/* Top status */}
                    <div className="relative z-10 flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        LIVE STREAM
                      </span>
                      <span className="text-slate-400 font-mono">4.8 FPS • Latency 42ms</span>
                    </div>

                    {/* Center bounding box visuals */}
                    <div className="relative z-10 grid grid-cols-3 gap-2 my-auto">
                      <div className="p-2 rounded bg-teal-500/20 border border-teal-400 text-[10px] text-teal-200 font-mono text-center shadow-[0_0_10px_rgba(0,242,254,0.3)]">
                        Person (0.96)
                      </div>
                      <div className="p-2 rounded bg-teal-500/20 border border-teal-400 text-[10px] text-teal-200 font-mono text-center shadow-[0_0_10px_rgba(0,242,254,0.3)]">
                        Person (0.94)
                      </div>
                      <div className="p-2 rounded bg-teal-500/20 border border-teal-400 text-[10px] text-teal-200 font-mono text-center shadow-[0_0_10px_rgba(0,242,254,0.3)]">
                        Person (0.91)
                      </div>
                    </div>

                    {/* Bottom Stream overlay summary */}
                    <div className="relative z-10 flex items-center justify-between text-xs pt-2 border-t border-white/10 text-slate-300">
                      <span>People Detected: <strong className="text-white">42</strong></span>
                      <span>Region: <strong className="text-teal-300">Active</strong></span>
                    </div>
                  </div>

                  {/* Summary Metric Footer */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                      <p className="text-[10px] text-slate-400 uppercase">Estimated Wait</p>
                      <p className="text-lg font-extrabold text-teal-300">12 minutes</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                      <p className="text-[10px] text-slate-400 uppercase">Queue Density</p>
                      <p className="text-lg font-extrabold text-white">65% Capacity</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (Section 5) */}
      <section id="how-it-works" className="py-20 border-t border-white/10 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
              COMPUTER VISION PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Six-Step Intelligent Queue Processing
            </h2>
            <p className="text-slate-400 text-sm">
              From raw optical frame capture to live student & staff decision intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <GlassCard key={step.num} className="p-6 relative group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-teal-400/40 font-mono group-hover:text-teal-300 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-teal-400" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section (Section 6) */}
      <section id="features" className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              ENTERPRISE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed for Modern Campus Operations
            </h2>
            <p className="text-slate-400 text-sm">
              Comprehensive tools empowering both campus staff and students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <GlassCard key={feat.title} glow="cyan" className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section (Section 33) */}
      <section className="py-20 border-t border-white/10 bg-hero-gradient relative">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Turn Campus Congestion Into Actionable Intelligence.
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Monitor queues, predict waiting times, and help campus teams respond before congestion becomes a problem.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/student/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/25 hover:scale-105 transition-all"
            >
              Launch QueueSense
            </Link>
            <Link
              href="/staff/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-white/15 text-slate-200 font-bold text-sm hover:bg-slate-800 transition-all"
            >
              Staff Command Center
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
