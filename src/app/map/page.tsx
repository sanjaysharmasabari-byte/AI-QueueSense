'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useQueue } from '@/context/QueueContext';
import { CampusMap } from '@/components/map/CampusMap';
import { MapPin, Sparkles } from 'lucide-react';

export default function MapPage() {
  const { locations } = useQueue();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#070A11]">
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Spatial Crowd Navigation
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Campus Map Overview
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Visual status layout of all monitored campus service points.
              </p>
            </div>
          </div>

          <CampusMap locations={locations} />
        </main>
      </div>
    </div>
  );
}
