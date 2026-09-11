'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CameraFeed } from '@/lib/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Camera, ShieldCheck, Eye, EyeOff, RefreshCw, Cpu, Activity, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface CameraMonitorProps {
  camera: CameraFeed;
  onCameraSelect?: (camId: string) => void;
  allCameras?: CameraFeed[];
}

export const CameraMonitor: React.FC<CameraMonitorProps> = ({
  camera,
  onCameraSelect,
  allCameras = [],
}) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [fps, setFps] = useState(camera.fps);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate dynamic simulated people coordinates for the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Create target positions for detected people
    const personCount = Math.min(60, Math.max(8, camera.detectedPeopleCount));
    const boxes = Array.from({ length: personCount }, (_, i) => ({
      x: 100 + (i % 8) * 85 + (Math.sin(i + Date.now() * 0.001) * 20),
      y: 120 + Math.floor(i / 8) * 60 + (Math.cos(i + Date.now() * 0.001) * 15),
      width: 42,
      height: 75,
      label: `Person ${(0.88 + (i % 10) * 0.01).toFixed(2)}`,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw dark grid lines (simulated video frame background)
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw perspective queue zone polygon
      ctx.beginPath();
      ctx.moveTo(80, 80);
      ctx.lineTo(canvas.width - 80, 80);
      ctx.lineTo(canvas.width - 40, canvas.height - 40);
      ctx.lineTo(40, canvas.height - 40);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 242, 254, 0.04)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Draw Queue Region Tag
      ctx.fillStyle = '#00F2FE';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('ACTIVE QUEUE REGION #1', 90, 70);

      // Draw Bounding Boxes if Overlay is ON
      if (showOverlay) {
        boxes.forEach((box) => {
          // Subtle movement simulation
          box.x += box.vx;
          box.y += box.vy;
          if (box.x < 50 || box.x > canvas.width - 90) box.vx *= -1;
          if (box.y < 90 || box.y > canvas.height - 100) box.vy *= -1;

          // Bounding box border
          ctx.strokeStyle = '#00F2FE';
          ctx.lineWidth = 1.8;
          ctx.strokeRect(box.x, box.y, box.width, box.height);

          // Box Corner Highlights
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(box.x - 2, box.y - 2, 6, 6);
          ctx.fillRect(box.x + box.width - 4, box.y - 2, 6, 6);

          // Tag label
          ctx.fillStyle = 'rgba(0, 242, 254, 0.85)';
          ctx.fillRect(box.x, box.y - 18, box.width + 18, 16);

          ctx.fillStyle = '#030712';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(box.label, box.x + 3, box.y - 5);

          // Abstract silhouette head dot
          ctx.beginPath();
          ctx.arc(box.x + box.width / 2, box.y + 16, 7, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
          ctx.fill();
        });
      }

      // Simulated Scan Line
      const scanY = (Date.now() * 0.08) % canvas.height;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [camera, showOverlay]);

  return (
    <GlassCard className="p-4 sm:p-5 overflow-hidden">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{camera.locationName}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">({camera.code})</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            YOLOv8 Computer Vision Live Inference Stream
          </p>
        </div>

        {/* Camera Selector Dropdown */}
        {allCameras.length > 0 && onCameraSelect && (
          <select
            value={camera.id}
            onChange={(e) => onCameraSelect(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 rounded-lg text-xs text-teal-700 dark:text-teal-300 font-medium focus:outline-none focus:border-teal-500"
          >
            {allCameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.locationName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Main Canvas Vision Frame */}
      <div className="relative rounded-xl border border-teal-500/30 overflow-hidden bg-slate-950 aspect-video shadow-2xl">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-full object-cover"
        />

        {/* Top-Left Live Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-emerald-400">LIVE FEED</span>
          <span className="text-slate-500">|</span>
          <span className="text-[11px] text-slate-300 font-mono">{camera.resolution}</span>
        </div>

        {/* Top-Right Metrics Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs">
          <Cpu className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-slate-300 text-[11px] font-mono">
            {camera.fps} FPS • {camera.processingLatencyMs}ms
          </span>
        </div>

        {/* Bottom Bar inside stream */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/10 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-medium">
              People Counted:{' '}
              <strong className="text-teal-300 text-sm font-bold ml-1">
                {camera.detectedPeopleCount}
              </strong>
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-300 text-[11px]">
              Region: <strong className="text-emerald-400 font-semibold">Active</strong>
            </span>
          </div>

          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-white/15 text-slate-200 hover:text-teal-300 text-[11px] font-medium transition-colors"
          >
            {showOverlay ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-teal-400" /> Overlay ON
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-400" /> Overlay OFF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300">
        <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
        <p className="text-[11px] leading-snug">
          <strong>Privacy-first detection:</strong> Faces are not identified, extracted, or stored. Frame sampling operates on anonymous numerical counts only.
        </p>
      </div>
    </GlassCard>
  );
};
