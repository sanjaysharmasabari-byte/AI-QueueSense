'use client';

import React from 'react';
import Link from 'next/link';
import { LocationItem } from '@/lib/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { QueueStatusBadge } from '@/components/ui/QueueStatusBadge';
import { Users, Clock, ArrowUpRight, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface QueueCardProps {
  location: LocationItem;
}

export const QueueCard: React.FC<QueueCardProps> = ({ location }) => {
  const glowType =
    location.status === 'High'
      ? 'red'
      : location.status === 'Medium'
      ? 'amber'
      : 'teal';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link href={`/queue/${location.id}`} className="block h-full">
        <GlassCard glow={glowType} className="p-5 flex flex-col justify-between h-full group">
          {/* Top header */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  {location.category} • {location.cameraCode}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  {location.name}
                  <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
              </div>
              <QueueStatusBadge status={location.status} />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
              {location.description}
            </p>
          </div>

          {/* Metric Stats Grid */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Queue Count</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {location.peopleCount} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">people</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Est. Wait</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {location.estimatedWaitMin} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">min</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Density Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Capacity Density</span>
                <span className="font-semibold text-slate-800 dark:text-slate-300">
                  {location.queueDensityPercent}% ({location.peopleCount}/{location.maxCapacity})
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    location.queueDensityPercent > 80
                      ? 'bg-rose-500'
                      : location.queueDensityPercent > 50
                      ? 'bg-amber-500'
                      : 'bg-teal-500 dark:bg-teal-400'
                  }`}
                  style={{ width: `${location.queueDensityPercent}%` }}
                />
              </div>
            </div>

            {/* Recommended timing pill */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5 text-[11px]">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" /> Best window:
              </span>
              <span className="text-teal-700 dark:text-teal-300 font-semibold truncate max-w-[170px]">
                {location.recommendedTimeWindow}
              </span>
            </div>

            {/* Footer timestamp */}
            <div className="text-[10px] text-slate-500 dark:text-slate-400 text-right font-medium">
              Updated {location.lastUpdated}
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
};
