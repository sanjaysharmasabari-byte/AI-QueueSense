'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: 'teal' | 'cyan' | 'amber' | 'red' | 'none';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = 'none',
  hoverEffect = true,
  ...props
}) => {
  const glowStyles = {
    none: '',
    teal: 'dark:border-teal-500/30 border-teal-400/40 shadow-[0_0_20px_rgba(0,242,254,0.1)]',
    cyan: 'dark:border-cyan-500/30 border-cyan-400/40 shadow-[0_0_20px_rgba(14,165,233,0.1)]',
    amber: 'dark:border-amber-500/30 border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]',
    red: 'dark:border-red-500/30 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'relative rounded-xl border backdrop-blur-md transition-all duration-300',
          'bg-white/80 border-slate-200 text-slate-800 shadow-md shadow-slate-200/50',
          'dark:bg-slate-900/60 dark:border-white/10 dark:text-slate-100 dark:shadow-none',
          hoverEffect &&
            'hover:border-teal-500/40 hover:shadow-lg dark:hover:bg-slate-900/80 hover:bg-white',
          glowStyles[glow],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
