'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useQueue } from '@/context/QueueContext';
import { CameraMonitor } from '@/components/camera/CameraMonitor';
import { GlassCard } from '@/components/ui/GlassCard';
import { Camera, ShieldCheck, Eye, Cpu, RefreshCw } from 'lucide-react';

export default function CameraPage() {
  const { cameras } = useQueue();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCamId, setActiveCamId] = useState(cameras[0]?.id || 'cam-01');

  const activeCamera = cameras.find((c) => c.id === activeCamId) || cameras[0];

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Optical Intelligence Layer
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Camera Stream Monitoring
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time YOLO object detection frame sampler for campus queue counters.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>YOLOv8 Core Active • FPS 4.8</span>
            </div>
          </div>

          {/* Featured Active Stream */}
          <CameraMonitor
            camera={activeCamera}
            onCameraSelect={setActiveCamId}
            allCameras={cameras}
          />

          {/* All Cameras Grid Matrix */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" /> All Monitored Camera Nodes ({cameras.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cameras.map((cam) => {
                const isActive = cam.id === activeCamId;
                return (
                  <GlassCard
                    key={cam.id}
                    onClick={() => setActiveCamId(cam.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      isActive
                        ? 'border-teal-500/60 bg-slate-900/90 ring-1 ring-teal-500/50'
                        : 'hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-white">{cam.code}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cam.status === 'LIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {cam.status}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm text-slate-200">{cam.locationName}</h4>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Detected: <strong className="text-teal-300">{cam.detectedPeopleCount}</strong></span>
                      <span>Confidence: <strong className="text-slate-300">{(cam.modelConfidence * 100).toFixed(0)}%</strong></span>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
