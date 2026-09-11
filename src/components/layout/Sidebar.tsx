'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQueue } from '@/context/QueueContext';
import {
  LayoutDashboard,
  Users,
  Camera,
  BarChart3,
  Bell,
  MapPin,
  Sparkles,
  ShieldCheck,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const pathname = usePathname();
  const { role, alerts } = useQueue();
  const unreadAlertCount = alerts.filter((a) => !a.isRead).length;

  const mainNavItems = [
    {
      name: role === 'staff' ? 'Staff Operations' : 'Student Overview',
      href: role === 'staff' ? '/staff/dashboard' : '/student/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Interactive Map',
      href: '/map',
      icon: MapPin,
    },
    {
      name: 'Camera Feeds',
      href: '/camera',
      icon: Camera,
    },
    {
      name: 'Analytics Center',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      name: 'Smart Alerts',
      href: '/alerts',
      icon: Bell,
      badge: unreadAlertCount > 0 ? unreadAlertCount : undefined,
    },
    {
      name: 'Location Directory',
      href: '/locations',
      icon: Users,
    },
    {
      name: 'AI Intelligence',
      href: '/queue/canteen',
      icon: Sparkles,
    },
    {
      name: 'Privacy Policy',
      href: '/privacy',
      icon: ShieldCheck,
    },
    {
      name: 'System Architecture',
      href: '/architecture',
      icon: Layers,
    },
    {
      name: 'Admin Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={clsx(
        'relative flex flex-col h-full bg-slate-950 border-r border-white/10 transition-all duration-300 z-30 select-none',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-400 p-[1px] shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-teal-400" />
            </div>
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="font-bold text-sm text-white tracking-tight">
                AI QueueSense
              </span>
              <p className="text-[10px] text-teal-400 -mt-0.5 font-medium uppercase tracking-wider">
                {role} Portal
              </p>
            </div>
          )}
        </Link>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors hidden md:block"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto custom-scrollbar">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all relative',
                isActive
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={clsx(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive
                    ? 'text-teal-400'
                    : 'text-slate-400 group-hover:text-teal-300'
                )}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}

              {item.badge !== undefined && (
                <span
                  className={clsx(
                    'rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 animate-pulse',
                    collapsed
                      ? 'absolute top-1 right-1 w-4 h-4'
                      : 'ml-auto px-1.5 py-0.2'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Role Widget */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10 bg-slate-900/50 m-2 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-teal-500/40 flex items-center justify-center text-xs font-bold text-teal-300">
                {role === 'staff' ? 'ST' : 'SD'}
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-slate-200">
                  {role === 'staff' ? 'Demo Staff' : 'Demo Student'}
                </p>
                <p className="text-[10px] text-slate-400">Campus Active</p>
              </div>
            </div>
            <Link
              href="/login"
              className="text-slate-400 hover:text-rose-400 p-1"
              title="Sign Out / Change User"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
};
