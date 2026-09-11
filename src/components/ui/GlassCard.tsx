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
    teal: 'border-teal-500/30 shadow-[0_0_20px_rgba(0,242,254,0.1)]',
    cyan: 'border-cyan-500/30 shadow-[0_0_20px_rgba(14,165,233,0.1)]',
    amber: 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]',
    red: 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'relative rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md transition-all duration-300',
          hoverEffect && 'hover:border-teal-500/40 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-teal-950/30',
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
