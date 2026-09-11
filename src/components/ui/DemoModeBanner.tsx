'use client';

import React from 'react';
import { useQueue } from '@/context/QueueContext';
import { Activity, Play, Pause, RefreshCw, ShieldCheck } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const { demoMode, setDemoMode, resetSimulation } = useQueue();

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-teal-500/20 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="font-bold text-teal-700 dark:text-teal-300 tracking-wider uppercase text-[11px]">
            SIMULATION / DEMO DATA ACTIVE
          </span>
          <span className="hidden md:inline-block text-slate-300 dark:text-slate-500">|</span>
          <span className="hidden md:inline-block text-slate-600 dark:text-slate-400 text-[11px]">
            Real-time simulated computer vision pipeline & AI wait forecasts
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1 shadow-sm dark:shadow-none">
            <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
            <span className="text-[11px] text-slate-800 dark:text-slate-300 font-medium">Demo Mode</span>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`ml-1 text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
                demoMode
                  ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {demoMode ? (
                <span className="flex items-center gap-1">
                  <Pause className="w-2.5 h-2.5" /> LIVE
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Play className="w-2.5 h-2.5" /> PAUSED
                </span>
              )}
            </button>
          </div>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors px-2 py-1 rounded bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 hover:border-teal-500/30 shadow-sm dark:shadow-none"
            title="Reset metrics to baseline demo values"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <span className="hidden lg:flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
            <ShieldCheck className="w-3 h-3" /> Privacy-First (No Facial Rec)
          </span>
        </div>
      </div>
    </div>
  );
};
