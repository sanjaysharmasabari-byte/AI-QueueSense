'use client';

import React, { useState } from 'react';
import { LocationItem } from '@/lib/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { QueueStatusBadge } from '@/components/ui/QueueStatusBadge';
import { MapPin, Users, Clock, ArrowRight, Sparkles, X } from 'lucide-react';
import Link from 'next/link';

interface CampusMapProps {
  locations: LocationItem[];
}

export const CampusMap: React.FC<CampusMapProps> = ({ locations }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);

  return (
    <GlassCard className="p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base text-white">Interactive Campus Crowd Map</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any campus queue node to inspect real-time density and wait estimates.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-950/80 px-3 py-1.5 rounded-lg border border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-slate-300">High</span>
          </div>
        </div>
      </div>

      {/* Campus Map Graphic Area */}
      <div className="relative w-full aspect-[16/9] min-h-[360px] bg-slate-950 rounded-xl border border-white/10 overflow-hidden shadow-inner p-4">
        {/* Grid & Pathway graphic background */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00F2FE" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Connecting campus walkways */}
          <path d="M 250 140 Q 450 120 680 110" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5,5" />
          <path d="M 450 120 L 450 240 L 750 280" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5,5" />
          <path d="M 250 140 L 150 220 L 300 300" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5,5" />
        </svg>

        {/* Campus Quad Center Graphic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 rounded-full border border-teal-500/20 bg-teal-500/5 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-500/40">
            Central Quad Plaza
          </span>
        </div>

        {/* Interactive Location Pins */}
        {locations.map((loc) => {
          const isSelected = selectedLocation?.id === loc.id;
          const pinColor =
            loc.status === 'High'
              ? 'bg-rose-500 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
              : loc.status === 'Medium'
              ? 'bg-amber-500 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
              : 'bg-emerald-500 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.6)]';

          return (
            <div
              key={loc.id}
              style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              onClick={() => setSelectedLocation(loc)}
            >
              {/* Pulsing ring */}
              <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${pinColor}`} />

              {/* Pin Pill Button */}
              <div
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-slate-950 backdrop-blur-md transition-all duration-300 transform group-hover:scale-110 ${
                  isSelected ? 'ring-2 ring-teal-400 scale-110 border-teal-400' : 'border-white/20'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${pinColor}`} />
                <span className="font-bold text-xs text-white tracking-wide">{loc.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({loc.peopleCount})</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Location Drawer Popup */}
      {selectedLocation && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-teal-500/40 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <QueueStatusBadge status={selectedLocation.status} />
              <h4 className="font-bold text-base text-white">{selectedLocation.name}</h4>
              <span className="text-xs text-slate-400">({selectedLocation.category})</span>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase">People Count</p>
              <p className="text-sm font-bold text-white">{selectedLocation.peopleCount}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase">Est. Wait</p>
              <p className="text-sm font-bold text-teal-300">{selectedLocation.estimatedWaitMin} min</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase">Queue Density</p>
              <p className="text-sm font-bold text-white">{selectedLocation.queueDensityPercent}%</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase">Best Time Window</p>
              <p className="text-xs font-semibold text-emerald-400 truncate">
                {selectedLocation.recommendedTimeWindow}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href={`/queue/${selectedLocation.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold hover:bg-teal-400 transition-colors shadow"
            >
              Open Full Queue Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
