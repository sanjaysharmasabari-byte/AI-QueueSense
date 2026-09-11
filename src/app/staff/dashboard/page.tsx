'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useQueue } from '@/context/QueueContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CameraMonitor } from '@/components/camera/CameraMonitor';
import { StaffActionPanel } from '@/components/dashboard/StaffActionPanel';
import { QueueTrendChart } from '@/components/analytics/QueueTrendChart';
import { LocationCompareChart } from '@/components/analytics/LocationCompareChart';
import { GlassCard } from '@/components/ui/GlassCard';
import { QueueStatusBadge } from '@/components/ui/QueueStatusBadge';
import {
  Camera,
  Users,
  AlertOctagon,
  Clock,
  Activity,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function StaffDashboardPage() {
  const { locations, cameras } = useQueue();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCamId, setSelectedCamId] = useState<string>(cameras[0]?.id || 'cam-01');

  const activeCamera = cameras.find((c) => c.id === selectedCamId) || cameras[0];
  const totalPeople = locations.reduce((sum, loc) => sum + loc.peopleCount, 0);
  const highCongestionLocs = locations.filter((loc) => loc.status === 'High');
  const avgWait = Math.round(
    locations.reduce((sum, loc) => sum + loc.estimatedWaitMin, 0) / locations.length
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
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Staff Operations Portal
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Operations Control Center
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time optical camera stream supervision, load balancing, and AI decision suggestions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/camera"
                className="px-3.5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                All Camera Feeds ({cameras.length})
              </Link>
            </div>
          </div>

          {/* Top Operational Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="ACTIVE CAMERAS"
              value={cameras.length}
              subtitle="100% online stream coverage"
              icon={Camera}
              colorScheme="cyan"
            />
            <MetricCard
              title="TOTAL PEOPLE MONITORED"
              value={totalPeople}
              subtitle="Anonymous real-time detection"
              icon={Users}
              colorScheme="teal"
            />
            <MetricCard
              title="HIGH CONGESTION SURGES"
              value={highCongestionLocs.length}
              subtitle="Requires action dispatch"
              icon={AlertOctagon}
              colorScheme="rose"
            />
            <MetricCard
              title="AVERAGE WAIT TIME"
              value={`${avgWait} min`}
              subtitle="Across all campus counters"
              icon={Clock}
              colorScheme="amber"
            />
          </div>

          {/* Proactive Staff Action Panel */}
          <StaffActionPanel highCongestionLocations={highCongestionLocs} />

          {/* Main Operations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: Live Camera Feed */}
            <div className="lg:col-span-7">
              <CameraMonitor
                camera={activeCamera}
                onCameraSelect={setSelectedCamId}
                allCameras={cameras}
              />
            </div>

            {/* RIGHT: Live Location Queue Status Panel */}
            <div className="lg:col-span-5 space-y-4">
              <GlassCard className="p-4 sm:p-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-400" />
                      <h3 className="font-bold text-sm text-white">Live Queue Monitor</h3>
                    </div>
                    <Link
                      href="/locations"
                      className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
                    >
                      Directory <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Location Table List */}
                  <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                    {locations.map((loc) => (
                      <Link
                        key={loc.id}
                        href={`/queue/${loc.id}`}
                        className="p-3 rounded-lg bg-slate-950/60 border border-white/5 hover:border-teal-500/30 flex items-center justify-between transition-all group"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white group-hover:text-teal-300">
                              {loc.name}
                            </span>
                            <span className="text-[10px] text-slate-500">{loc.cameraCode}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {loc.peopleCount} people • Density: {loc.queueDensityPercent}%
                          </p>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1">
                          <QueueStatusBadge status={loc.status} size="sm" />
                          <span className="text-[10px] text-slate-400">
                            Est. wait: <strong className="text-slate-200">{loc.estimatedWaitMin} min</strong>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Automatic inference sampling active</span>
                  <span className="text-teal-300 font-semibold">FPS: 4.8</span>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Bottom Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-5">
              <QueueTrendChart data={locations[0].hourlyTrends} title="Hourly Canteen Inflow vs Wait Time" />
            </GlassCard>

            <GlassCard className="p-5">
              <LocationCompareChart locations={locations} />
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
}
