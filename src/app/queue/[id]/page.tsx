'use client';

import React, { useState, use } from 'react';
import { notFound } from 'next/navigation';
import { useQueue } from '@/context/QueueContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { QueueStatusBadge } from '@/components/ui/QueueStatusBadge';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { QueueTrendChart } from '@/components/analytics/QueueTrendChart';
import { CameraMonitor } from '@/components/camera/CameraMonitor';
import {
  Users,
  Clock,
  Activity,
  Zap,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

export default function QueueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { locations, cameras } = useQueue();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const location = locations.find((l) => l.id === id) || locations[0];
  const camera = cameras.find((c) => c.locationId === location.id) || cameras[0];

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
          {/* Back Navigation Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/student/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <span className="text-xs text-slate-500 font-mono">
              Location ID: {location.id} • {location.cameraCode}
            </span>
          </div>

          {/* Title Header with Large Status Indicator */}
          <GlassCard glow="teal" className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    {location.category} Counter
                  </span>
                  <QueueStatusBadge status={location.status} size="lg" />
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  {location.name} Queue
                </h1>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  {location.description}
                </p>
              </div>

              {/* Large Status Banner Widget */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex items-center gap-4">
                <div className="text-center pr-4 border-r border-white/10">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">STATUS</p>
                  <p
                    className={`text-lg font-black ${
                      location.status === 'High'
                        ? 'text-rose-400'
                        : location.status === 'Medium'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {location.status.toUpperCase()}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">ESTIMATED WAIT</p>
                  <p className="text-2xl font-extrabold text-teal-300">
                    {location.estimatedWaitMin} <span className="text-xs font-normal">min</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Core Metrics Grid (Section 9 Requirements) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Users className="w-3.5 h-3.5 text-teal-400" /> Current People
                </div>
                <p className="text-xl font-bold text-white">{location.peopleCount}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Estimated Wait
                </div>
                <p className="text-xl font-bold text-cyan-300">{location.estimatedWaitMin} minutes</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Activity className="w-3.5 h-3.5 text-amber-400" /> Queue Density
                </div>
                <p className="text-xl font-bold text-amber-300">{location.queueDensityPercent}%</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> Avg Service Time
                </div>
                <p className="text-xl font-bold text-white">{location.avgServiceTimeSec} sec/person</p>
              </div>
            </div>
          </GlassCard>

          {/* AI Intelligence Panel */}
          <AIInsightCard location={location} />

          {/* Camera Stream & Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <CameraMonitor camera={camera} />
            </div>

            <div className="lg:col-span-6">
              <GlassCard className="p-5 h-full flex flex-col justify-between">
                <QueueTrendChart
                  data={location.hourlyTrends}
                  title={`${location.name} Queue Size & Waiting Time Trend`}
                />
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
