'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2, Cpu } from 'lucide-react';

export default function PrivacyPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const principles = [
    {
      title: 'No Facial Recognition',
      desc: 'Our optical pipeline processes anonymous pixel bounding boxes. Facial keypoints and biometric descriptors are explicitly disabled.',
      icon: EyeOff,
    },
    {
      title: 'No Identity Tracking',
      desc: 'Individual students are never identified, tagged, or cross-referenced with campus student registration databases.',
      icon: Lock,
    },
    {
      title: 'No Video Frame Storage',
      desc: 'Raw video stream frames are discarded immediately after in-memory inference calculation. No video recordings are persisted.',
      icon: ShieldCheck,
    },
    {
      title: 'Anonymous Counting Only',
      desc: 'Only numeric crowd counts (e.g. 42 people) and queue boundary density metrics are stored for temporal forecasting.',
      icon: Cpu,
    },
    {
      title: 'Minimal Data Collection',
      desc: 'We adhere strictly to privacy-by-design principles, capturing only what is required to predict queue waiting duration.',
      icon: FileText,
    },
    {
      title: 'Institutional Compliance',
      desc: 'Designed to comply with institutional data privacy guidelines, FERPA regulations, and international privacy standards.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#070A11]">
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Ethical AI & Compliance Hub
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Privacy-First Architecture
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Transparency documentation on how AI QueueSense protects student privacy and anonymity.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Anonymous System
            </div>
          </div>

          {/* Privacy Principles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <GlassCard key={p.title} glow="teal" className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white">{p.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                </GlassCard>
              );
            })}
          </div>

          {/* Institutional Guarantee Card */}
          <GlassCard className="p-6 bg-slate-900/90 border-emerald-500/30">
            <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" /> Official Privacy Guarantee
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              "AI QueueSense is engineered from the ground up as a non-intrusive crowd sensing platform. Camera streams perform real-time pixel object detection locally or in transient inference buffers. No facial features, biometric data, or personal identifying information are ever extracted or stored."
            </p>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
