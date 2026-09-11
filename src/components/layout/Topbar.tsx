'use client';

import React, { useState } from 'react';
import { useQueue } from '@/context/QueueContext';
import Link from 'next/link';
import { Search, Bell, Sparkles, User, Check, Menu, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TopbarProps {
  onMobileMenuToggle?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onMobileMenuToggle,
  searchQuery = '',
  onSearchChange,
}) => {
  const { role, setRole, alerts, markAlertRead } = useQueue();
  const [alertsOpen, setAlertsOpen] = useState(false);
  const unreadAlerts = alerts.filter((a) => !a.isRead);

  return (
    <header className="h-16 border-b border-white/10 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search queue locations (Canteen, Admin, Library)..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Toggle Pill */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 border border-white/10 rounded-lg p-1">
          <button
            onClick={() => setRole('student')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              role === 'student'
                ? 'bg-teal-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Student Portal
          </button>
          <button
            onClick={() => setRole('staff')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              role === 'staff'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Staff Command
          </button>
        </div>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="relative p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-teal-500/30 transition-all"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-bounce">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {alertsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-white/15 rounded-xl shadow-2xl z-50 p-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span className="font-semibold text-xs text-white">
                      Live Queue Alerts ({alerts.length})
                    </span>
                  </div>
                  <Link
                    href="/alerts"
                    onClick={() => setAlertsOpen(false)}
                    className="text-[11px] text-teal-400 hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="py-2 space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                  {alerts.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">
                      No active alerts right now.
                    </p>
                  ) : (
                    alerts.slice(0, 4).map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => markAlertRead(alert.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          alert.isRead
                            ? 'bg-slate-950/40 border-white/5 opacity-70'
                            : 'bg-slate-800/80 border-teal-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">
                            {alert.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                          {alert.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-teal-300" />
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-white leading-none">
              {role === 'staff' ? 'Demo Staff Officer' : 'Demo Student'}
            </p>
            <p className="text-[10px] text-slate-400 capitalize mt-0.5">
              {role} Account
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
