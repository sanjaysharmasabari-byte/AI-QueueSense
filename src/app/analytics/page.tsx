'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useQueue } from '@/context/QueueContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { QueueTrendChart } from '@/components/analytics/QueueTrendChart';
import { LocationCompareChart } from '@/components/analytics/LocationCompareChart';
import { BarChart3, Clock, Users, Activity, Calendar, Download, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
  const { locations } = useQueue();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState<'1H' | '6H' | '24H' | '7D' | '30D'>('24H');

  // Compute aggregated stats
  const totalMonitoredEvents = 14280;
  const avgWaitTime = Math.round(
    locations.reduce((sum, l) => sum + l.estimatedWaitMin, 0) / locations.length
  );
  const peakQueueSize = Math.max(...locations.map((l) => l.peopleCount));
  const avgQueueDensity = Math.round(
    locations.reduce((sum, l) => sum + l.queueDensityPercent, 0) / locations.length
  );

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Historical Intelligence & Trends
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Queue Analytics Center
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Data-driven reports, hourly congestion volume, and multi-location benchmarks.
              </p>
            </div>

            {/* Time Filter Tabs (Section 16 requirement) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 border border-white/10 p-1 rounded-xl text-xs">
                {(['1H', '6H', '24H', '7D', '30D'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      timeRange === range
                        ? 'bg-teal-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Analytics Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="AVERAGE WAIT TIME"
              value={`${avgWaitTime} min`}
              subtitle="-18% from last week"
              icon={Clock}
              colorScheme="cyan"
            />
            <MetricCard
              title="PEAK QUEUE SIZE"
              value={`${peakQueueSize} people`}
              subtitle="Recorded at Admin Office"
              icon={Users}
              colorScheme="rose"
            />
            <MetricCard
              title="AVG QUEUE DENSITY"
              value={`${avgQueueDensity}%`}
              subtitle="Monitored across 6 counters"
              icon={Activity}
              colorScheme="teal"
            />
            <MetricCard
              title="TOTAL MONITORED EVENTS"
              value={totalMonitoredEvents.toLocaleString()}
              subtitle="AI inferences processed"
              icon={BarChart3}
              colorScheme="amber"
            />
          </div>

          {/* Analytics Charts Suite */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-5">
              <QueueTrendChart
                data={locations[0].hourlyTrends}
                title="Hourly Queue Inflow & Wait Time Distribution (24H)"
                height={300}
              />
            </GlassCard>

            <GlassCard className="p-5">
              <LocationCompareChart locations={locations} height={300} />
            </GlassCard>
          </div>

          {/* Weekly Performance Benchmarks Table */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-sm text-white">Location Congestion Heatmap Data</h3>
              </div>

              <button className="flex items-center gap-1.5 text-xs text-teal-300 hover:underline">
                <Download className="w-3.5 h-3.5" /> Export CSV Report
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Location</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Avg Daily Count</th>
                    <th className="p-3">Peak Hour</th>
                    <th className="p-3">Avg Wait Time</th>
                    <th className="p-3">Efficiency Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {locations.map((loc) => (
                    <tr key={loc.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-white">{loc.name}</td>
                      <td className="p-3 text-slate-400">{loc.category}</td>
                      <td className="p-3 font-mono">{loc.peopleCount * 4} / day</td>
                      <td className="p-3 font-semibold text-teal-300">12:30 PM - 1:30 PM</td>
                      <td className="p-3 font-mono">{loc.estimatedWaitMin} min</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          Grade A (Optimal)
                        </span>
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
