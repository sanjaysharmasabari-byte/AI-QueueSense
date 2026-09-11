'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useQueue } from '@/context/QueueContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { QueueCard } from '@/components/dashboard/QueueCard';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Filter,
  Sparkles,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { locations } = useQueue();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Summary counts
  const totalActive = locations.length;
  const lowCount = locations.filter((l) => l.status === 'Low').length;
  const mediumCount = locations.filter((l) => l.status === 'Medium').length;
  const highCount = locations.filter((l) => l.status === 'High').length;

  // Filtered locations list
  const filteredLocations = locations.filter((loc) => {
    const matchesStatus =
      statusFilter === 'ALL' || loc.status.toUpperCase() === statusFilter;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#070A11]">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Good afternoon • Student Portal
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Campus Queue Overview
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Real-time congestion levels, live crowd counts, and AI-predicted waiting times.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                Live Camera Feeds Active
              </span>
            </div>
          </div>

          {/* Top 4 Summary Metric Cards (Section 8) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="TOTAL ACTIVE QUEUES"
              value={totalActive}
              subtitle="Monitored by vision cameras"
              icon={Layers}
              colorScheme="teal"
            />
            <MetricCard
              title="LOW CONGESTION"
              value={lowCount}
              subtitle="Shortest wait (under 5 min)"
              icon={CheckCircle2}
              colorScheme="emerald"
            />
            <MetricCard
              title="MEDIUM CONGESTION"
              value={mediumCount}
              subtitle="Moderate line (5-15 min)"
              icon={AlertTriangle}
              colorScheme="amber"
            />
            <MetricCard
              title="HIGH CONGESTION"
              value={highCount}
              subtitle="Long wait (over 15 min)"
              icon={AlertOctagon}
              colorScheme="rose"
            />
          </div>

          {/* Main Queue Status Cards Filter Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400" />
              <h2 className="font-bold text-base text-slate-900 dark:text-white">LIVE QUEUE STATUS</h2>
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-white/10 p-1 rounded-xl text-xs">
              <span className="text-slate-600 dark:text-slate-500 text-[11px] px-2 font-medium">Filter:</span>
              {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-teal-500 text-slate-950 shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Location Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 space-y-2">
                <Filter className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold">No queues match your selected filter.</p>
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className="text-xs text-teal-400 underline"
                >
                  Clear filter
                </button>
              </div>
            ) : (
              filteredLocations.map((location) => (
                <QueueCard key={location.id} location={location} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
