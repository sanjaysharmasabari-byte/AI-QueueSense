'use client';

import React, { useState } from 'react';
import { LocationItem } from '@/lib/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { AlertOctagon, UserPlus, Bell, Eye, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface StaffActionPanelProps {
  highCongestionLocations: LocationItem[];
}

export const StaffActionPanel: React.FC<StaffActionPanelProps> = ({
  highCongestionLocations,
}) => {
  const [actionsTaken, setActionsTaken] = useState<Record<string, string>>({});

  if (highCongestionLocations.length === 0) {
    return (
      <GlassCard className="p-4 bg-emerald-500/5 border-emerald-500/20">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-xs text-white">Optimal Operations</h4>
            <p className="text-[11px] text-slate-400">
              No severe congestion surges detected across active campus counters.
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  const handleTakeAction = (locId: string, actionName: string) => {
    setActionsTaken((prev) => ({
      ...prev,
      [locId]: actionName,
    }));
  };

  return (
    <div className="space-y-3">
      {highCongestionLocations.map((loc) => {
        const actionDone = actionsTaken[loc.id];

        return (
          <GlassCard
            key={loc.id}
            glow="red"
            className="p-5 border-rose-500/40 bg-white/90 dark:bg-slate-900/90"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                  <AlertOctagon className="w-5 h-5 text-rose-500 dark:text-rose-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">
                      HIGH CONGESTION SURGE DETECTED
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">({loc.peopleCount} people)</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{loc.name}</h3>
                </div>
              </div>

              <span className="text-xs font-mono text-rose-600 dark:text-rose-300 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full">
                Wait: {loc.estimatedWaitMin} min
              </span>
            </div>

            {/* AI Operational Suggestion */}
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 mb-4">
              <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold mb-1 flex items-center gap-1.5">
                AI-Assisted Operational Suggestion:
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                "Consider opening an auxiliary counter desk or reallocating auxiliary staff to {loc.name} during the current surge to reduce wait times by an estimated 45%."
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              {actionDone ? (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" /> Action Initiated: {actionDone}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTakeAction(loc.id, 'Open Auxiliary Counter')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors shadow"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Open Auxiliary Counter
                  </button>
                  <button
                    onClick={() => handleTakeAction(loc.id, 'Staff Dispatch Alert Sent')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-white/10 transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    Notify Staff
                  </button>
                  <Link
                    href={`/queue/${loc.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    View Details
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-1 text-[10px] text-slate-400 italic">
                <ShieldAlert className="w-3 h-3 text-slate-500" />
                Human staff member must make the final decision.
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
