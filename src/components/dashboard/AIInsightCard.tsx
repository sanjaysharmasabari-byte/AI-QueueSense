'use client';

import React from 'react';
import { LocationItem } from '@/lib/types';
import { getAIPrediction } from '@/lib/queueEngine';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sparkles, TrendingUp, TrendingDown, Minus, Info, ShieldCheck, Clock } from 'lucide-react';

interface AIInsightCardProps {
  location: LocationItem;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ location }) => {
  const prediction = getAIPrediction(location);

  return (
    <GlassCard glow="teal" className="p-5 relative overflow-hidden">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-300 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">AI Queue Intelligence</span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono ml-2">
              (Model v2.4-CV)
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
          AI-Assisted Estimate
        </span>
      </div>

      {/* Grid of Predictions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase">Current Queue</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            {prediction.currentQueue} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">people</span>
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase">Predicted Wait</p>
          <p className="text-xl font-extrabold text-teal-600 dark:text-teal-300 mt-0.5">
            {prediction.predictedWaitMin} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">min</span>
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase">Next 15 Min Forecast</p>
          <p className="text-xl font-extrabold text-cyan-600 dark:text-cyan-300 mt-0.5">
            ~{prediction.next15MinWait} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">min</span>
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase">Inflow Trend</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {prediction.trend === 'Increasing' ? (
              <span className="text-amber-600 dark:text-amber-400 font-bold text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Rising
              </span>
            ) : prediction.trend === 'Decreasing' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1">
                <TrendingDown className="w-4 h-4" /> Dropping
              </span>
            ) : (
              <span className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-1">
                <Minus className="w-4 h-4" /> Stable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Visit Timing Banner */}
      <div className="p-3.5 rounded-lg bg-teal-50 dark:bg-gradient-to-r dark:from-teal-950/50 dark:to-slate-900 border border-teal-300 dark:border-teal-500/30 mb-3 flex items-start gap-3">
        <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300">Recommended Visit Time</h4>
          <p className="text-xs text-slate-800 dark:text-white mt-0.5">
            Try visiting between <strong className="text-teal-700 dark:text-teal-200 underline">{location.recommendedTimeWindow}</strong> for significantly lower expected congestion.
          </p>
        </div>
      </div>

      {/* AI Explanation & Disclaimer */}
      <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950/40 p-2.5 rounded-md border border-slate-200 dark:border-white/5">
        <p className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
          {prediction.aiExplanation}
        </p>
        <p className="text-[10px] text-slate-500 italic pl-5">
          * Note: AI estimates are non-binding operational predictions computed from computer vision density trends and sample schedules.
        </p>
      </div>
    </GlassCard>
  );
};
