'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useQueue } from '@/context/QueueContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { QueueStatusBadge } from '@/components/ui/QueueStatusBadge';
import { Users, Camera, ArrowRight, Search, Plus } from 'lucide-react';
import Link from 'next/link';

export default function LocationsPage() {
  const { locations } = useQueue();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = locations.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#070A11]">
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Monitored Counter Directory
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Campus Queue Locations
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Full list of active campus counters, hardware camera pairings, and density thresholds.
              </p>
            </div>
          </div>

          <GlassCard className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter locations..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Showing {filtered.length} of {locations.length} counters
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Location</th>
                    <th className="p-3">Camera Node</th>
                    <th className="p-3">People Count</th>
                    <th className="p-3">Density %</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Est. Wait</th>
                    <th className="p-3">Last Updated</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                  {filtered.map((loc) => (
                    <tr key={loc.id} className="hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{loc.name}</div>
                        <div className="text-[10px] text-slate-500">{loc.category}</div>
                      </td>
                      <td className="p-3 font-mono text-cyan-600 dark:text-cyan-300 flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-slate-400" />
                        {loc.cameraCode}
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{loc.peopleCount}</td>
                      <td className="p-3 font-mono">{loc.queueDensityPercent}%</td>
                      <td className="p-3">
                        <QueueStatusBadge status={loc.status} size="sm" />
                      </td>
                      <td className="p-3 font-semibold text-teal-600 dark:text-teal-300">
                        {loc.estimatedWaitMin} min
                      </td>
                      <td className="p-3 text-slate-500 dark:text-slate-400">{loc.lastUpdated}</td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/queue/${loc.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-semibold hover:bg-teal-500/20 text-xs transition-colors"
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
