'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Camera, Layers, Scan, Cpu, GitBranch, LayoutDashboard, RefreshCw, ArrowDown } from 'lucide-react';

export default function ArchitecturePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pipeline = [
    {
      stage: 'STAGE 01',
      name: 'REAL-WORLD SOURCE',
      desc: 'High-definition optical USB/IP cameras mounted above campus queue stanchions.',
      icon: Camera,
      badge: 'Hardware Layer',
    },
    {
      stage: 'STAGE 02',
      name: 'DATA ACQUISITION',
      desc: 'Frame sampling buffer converts raw RTSP stream to 3-5 FPS image tensors.',
      icon: Layers,
      badge: 'Ingestion Layer',
    },
    {
      stage: 'STAGE 03',
      name: 'PRE-PROCESSING',
      desc: 'Image normalization, polygon queue region cropping, and dynamic noise reduction.',
      icon: Scan,
      badge: 'CV Pre-Processing',
    },
    {
      stage: 'STAGE 04',
      name: 'AI / ML ENGINE',
      desc: 'YOLOv8 object detector infers person bounding boxes with confidence scoring.',
      icon: Cpu,
      badge: 'Inference Engine',
    },
    {
      stage: 'STAGE 05',
      name: 'DECISION LOGIC',
      desc: 'Density calculation formula, service rate tracking, and wait time regression forecasting.',
      icon: GitBranch,
      badge: 'Analytical Logic',
    },
    {
      stage: 'STAGE 06',
      name: 'USER INTERFACE',
      desc: 'Next.js 15 App Router web dashboards deliver real-time metrics to students & staff.',
      icon: LayoutDashboard,
      badge: 'Frontend Layer',
    },
    {
      stage: 'STAGE 07',
      name: 'FEEDBACK LOOP',
      desc: 'Automated staff dispatch recommendations and auxiliary counter opening triggers.',
      icon: RefreshCw,
      badge: 'Operational Loop',
    },
  ];

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
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                End-to-End System Design
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                System Architecture
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Overview of the 7-stage data pipeline powering real-time campus queue intelligence.
              </p>
            </div>
          </div>

          {/* Pipeline Visual Flow */}
          <div className="max-w-4xl mx-auto space-y-4">
            {pipeline.map((p, idx) => {
              const Icon = p.icon;
              return (
                <React.Fragment key={p.stage}>
                  <GlassCard glow="cyan" className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-cyan-400">
                            {p.stage}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded bg-slate-950 text-slate-400 border border-white/10">
                            {p.badge}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-base text-white">{p.name}</h3>
                        <p className="text-xs text-slate-300 mt-1">{p.desc}</p>
                      </div>
                    </div>
                  </GlassCard>

                  {idx < pipeline.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ArrowDown className="w-5 h-5 text-cyan-500/60 animate-bounce" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
