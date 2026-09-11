'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useQueue } from '@/context/QueueContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Settings, Sliders, Bell, Shield, Camera, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { thresholds, updateThresholds } = useQueue();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [lowMax, setLowMax] = useState(thresholds.lowMax);
  const [mediumMax, setMediumMax] = useState(thresholds.mediumMax);
  const [sensitivity, setSensitivity] = useState(thresholds.alertSensitivity);
  const [autoNotify, setAutoNotify] = useState(thresholds.autoStaffNotification);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds({
      lowMax: Number(lowMax),
      mediumMax: Number(mediumMax),
      highMin: Number(mediumMax) + 1,
      alertSensitivity: sensitivity,
      autoStaffNotification: autoNotify,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Staff Control Panel
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Admin Configuration
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Configure operational thresholds, camera parameters, and smart alert sensitivities.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Congestion Threshold Configuration (Section 21 Requirement) */}
            <GlassCard glow="teal" className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold text-base text-white">Congestion Threshold Settings</h3>
                </div>
                <span className="text-xs text-slate-400">
                  Customizable operational ranges
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
                  <span className="text-xs font-bold uppercase text-emerald-400">
                    Low Congestion Threshold
                  </span>
                  <p className="text-[11px] text-slate-400 my-1">Maximum people count for LOW status</p>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      value={lowMax}
                      onChange={(e) => setLowMax(Number(e.target.value))}
                      className="w-20 px-3 py-1.5 bg-slate-900 border border-white/15 rounded-lg text-sm text-white font-bold font-mono focus:outline-none focus:border-emerald-400"
                    />
                    <span className="text-xs text-slate-400">people (0–{lowMax})</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
                  <span className="text-xs font-bold uppercase text-amber-400">
                    Medium Congestion Threshold
                  </span>
                  <p className="text-[11px] text-slate-400 my-1">Maximum people count for MEDIUM status</p>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      value={mediumMax}
                      onChange={(e) => setMediumMax(Number(e.target.value))}
                      className="w-20 px-3 py-1.5 bg-slate-900 border border-white/15 rounded-lg text-sm text-white font-bold font-mono focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-xs text-slate-400">people ({lowMax + 1}–{mediumMax})</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30">
                  <span className="text-xs font-bold uppercase text-rose-400">
                    High Congestion Threshold
                  </span>
                  <p className="text-[11px] text-slate-400 my-1">Minimum people count for HIGH status</p>
                  <div className="mt-2">
                    <span className="text-lg font-black text-rose-400 font-mono">
                      {Number(mediumMax) + 1}+ people
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Notification & Sensitivity Settings */}
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <Bell className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Alert Sensitivity & Dispatch</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Alert Sensitivity Level
                  </label>
                  <select
                    value={sensitivity}
                    onChange={(e) => setSensitivity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="low">Low (Fewer alerts, only extreme surges)</option>
                    <option value="medium">Medium (Standard campus balanced mode)</option>
                    <option value="high">High (Proactive immediate alert triggers)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-white/10">
                  <div>
                    <h4 className="text-xs font-bold text-white">Auto Staff Dispatch</h4>
                    <p className="text-[11px] text-slate-400">
                      Trigger auxiliary counter suggestion when queue exceeds HIGH threshold.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoNotify}
                    onChange={(e) => setAutoNotify(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-slate-900 text-teal-500 focus:ring-0"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" /> Threshold Settings Saved Successfully!
                </div>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Admin Configurations
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
