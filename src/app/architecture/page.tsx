'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Camera, Layers, Scan, Cpu, GitBranch, LayoutDashboard, RefreshCw, ArrowDown, Database, Terminal, Server } from 'lucide-react';

export default function ArchitecturePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const coreNodes = [
    {
      id: 'cameras',
      title: 'IP / USB Cameras',
      subtitle: 'RTSP or webcam feed',
      desc: 'High-definition optical video capture mounted above campus queue stanchions.',
      icon: Camera,
      color: 'border-slate-500 bg-slate-900/90 text-slate-300',
      badge: 'Capture Source',
    },
    {
      id: 'detector',
      title: 'YOLOv8 Detector',
      subtitle: 'Counts people per region',
      desc: 'OpenCV frame sampler runs Ultralytics YOLOv8 object detection inside defined ROI polygons.',
      icon: Cpu,
      color: 'border-amber-500/50 bg-amber-950/40 text-amber-300',
      badge: 'Computer Vision',
    },
    {
      id: 'backend',
      title: 'FastAPI Backend + DB',
      subtitle: 'Stores live counts, history',
      desc: 'Python FastAPI service provides REST endpoints & WebSocket connections for live data streaming.',
      icon: Server,
      color: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300',
      badge: 'Data & Prediction Layer',
    },
    {
      id: 'frontend',
      title: 'Next.js Dashboard',
      subtitle: 'Polls or subscribes for live data',
      desc: 'Next.js 15 App Router web dashboards render real-time crowd metrics, map pins, and AI forecasts.',
      icon: LayoutDashboard,
      color: 'border-indigo-500/50 bg-indigo-950/40 text-indigo-300',
      badge: 'Presentation Layer',
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#070A11]">
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
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                End-to-End System Design
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                Camera to Dashboard Pipeline
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Full architectural pipeline connecting optical video capture, YOLOv8 inference, Python FastAPI, and Next.js frontend.
              </p>
            </div>
          </div>

          {/* Flow Diagram (Matching Claude Screenshot Architecture) */}
          <div className="max-w-2xl mx-auto py-4 space-y-3">
            <div className="text-center pb-2">
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full">
                Full camera to dashboard pipeline architecture
              </span>
            </div>

            {coreNodes.map((node, idx) => {
              const Icon = node.icon;
              return (
                <React.Fragment key={node.id}>
                  <GlassCard className={`p-5 border ${node.color} relative transition-all hover:scale-[1.01]`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            {node.badge}
                          </span>
                          <h3 className="font-extrabold text-lg text-white">{node.title}</h3>
                          <p className="text-xs font-mono text-slate-300 mt-0.5">{node.subtitle}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-white/5">
                      {node.desc}
                    </p>
                  </GlassCard>

                  {idx < coreNodes.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="w-5 h-5 text-teal-400 animate-bounce" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Python Backend Code Snippet Card */}
          <GlassCard className="p-5 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-sm text-white">FastAPI Python Backend Module (`backend/main.py`)</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Port 8000 • WebSocket Active</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-xs text-slate-300 overflow-x-auto">
              <p className="text-teal-400"># Start Python FastAPI AI Service</p>
              <p className="text-slate-400">$ cd backend</p>
              <p className="text-slate-400">$ pip install -r requirements.txt</p>
              <p className="text-emerald-400">$ uvicorn main:app --reload --port 8000</p>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
