'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Footer } from '@/components/layout/Footer';
import { useQueue } from '@/context/QueueContext';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Camera,
  Trash2,
  CheckCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

export default function AlertsPage() {
  const { alerts, markAlertRead, dismissAlert, clearAllAlerts } = useQueue();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity.toUpperCase() === filterSeverity;
  });

  const getAlertIcon = (type: string, severity: string) => {
    if (type === 'CAMERA_STATUS') return <Camera className="w-5 h-5 text-amber-400" />;
    if (type === 'IMPROVEMENT') return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    if (severity === 'critical') return <AlertOctagon className="w-5 h-5 text-rose-400" />;
    return <AlertTriangle className="w-5 h-5 text-amber-400" />;
  };

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
              <p className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Event Notification Feed
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Smart Alert Center
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Automated threshold alerts, waiting time escalations, and hardware status updates.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearAllAlerts}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 text-xs font-medium hover:text-rose-400 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All Alerts
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 font-semibold">Filter Severity:</span>
            </div>

            <div className="flex gap-1">
              {['ALL', 'CRITICAL', 'WARNING', 'INFO', 'SUCCESS'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterSeverity === sev
                      ? 'bg-teal-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Alerts Feed */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <GlassCard className="p-8 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="font-semibold text-sm">No active alerts right now.</p>
                <p className="text-xs text-slate-500">All monitored queue thresholds are normal.</p>
              </GlassCard>
            ) : (
              filteredAlerts.map((alert) => (
                <GlassCard
                  key={alert.id}
                  glow={
                    alert.severity === 'critical'
                      ? 'red'
                      : alert.severity === 'warning'
                      ? 'amber'
                      : 'teal'
                  }
                  className={`p-4 sm:p-5 transition-all ${
                    alert.isRead ? 'opacity-65 bg-slate-950/40' : 'bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-white/10 shrink-0">
                        {getAlertIcon(alert.type, alert.severity)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-extrabold text-sm text-white">{alert.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-950 text-slate-300 border border-white/10">
                            {alert.locationName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                      <Link
                        href={`/queue/${alert.locationId}`}
                        className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold hover:bg-teal-500/20 transition-all flex items-center gap-1"
                      >
                        View Queue <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      {!alert.isRead && (
                        <button
                          onClick={() => markAlertRead(alert.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
                          title="Mark Read"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                        title="Dismiss Alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
