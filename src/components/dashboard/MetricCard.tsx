'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  colorScheme?: 'teal' | 'cyan' | 'amber' | 'emerald' | 'rose';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'teal',
}) => {
  const schemeStyles = {
    teal: 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
  };

  return (
    <GlassCard className="p-4 sm:p-5 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">
          {title}
        </p>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className={clsx(
          'w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-inner',
          schemeStyles[colorScheme]
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
    </GlassCard>
  );
};
