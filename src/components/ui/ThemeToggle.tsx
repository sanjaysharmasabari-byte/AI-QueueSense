'use client';

import React from 'react';
import { useQueue } from '@/context/QueueContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useQueue();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl border transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-slate-900 border-white/10 text-amber-400 hover:border-amber-400/40 hover:bg-slate-800'
          : 'bg-white border-slate-200 text-teal-600 hover:border-teal-400 hover:bg-slate-50 shadow-sm'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme mode"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-center"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700" />
        )}
      </motion.div>

      {showLabel && (
        <span className="text-xs font-semibold select-none">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
