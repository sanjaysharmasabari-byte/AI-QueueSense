'use client';

import React from 'react';
import { CongestionLevel } from '@/lib/types';
import { clsx } from 'clsx';

interface QueueStatusBadgeProps {
  status: CongestionLevel;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const QueueStatusBadge: React.FC<QueueStatusBadgeProps> = ({
  status,
  size = 'md',
  showPulse = true,
}) => {
  const styles = {
    Low: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    Medium: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400',
    },
    High: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2.5 font-semibold',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const config = styles[status] || styles.Low;

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border backdrop-blur-sm tracking-wide transition-colors',
        config.bg,
        sizeClasses[size]
      )}
    >
      {showPulse && (
        <span className="relative flex items-center justify-center">
          <span
            className={clsx(
              'absolute inline-flex rounded-full opacity-75 animate-ping',
              config.dot,
              dotSizes[size]
            )}
          />
          <span
            className={clsx(
              'relative inline-flex rounded-full',
              config.dot,
              dotSizes[size]
            )}
          />
        </span>
      )}
      {status}
    </span>
  );
};
