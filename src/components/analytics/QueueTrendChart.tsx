'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface QueueTrendChartProps {
  data: { time: string; count: number; wait: number }[];
  title?: string;
  height?: number;
}

export const QueueTrendChart: React.FC<QueueTrendChartProps> = ({
  data,
  title = 'Hourly Queue Count & Wait Trend',
  height = 280,
}) => {
  return (
    <div className="w-full">
      {title && (
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
          {title}
        </h4>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00F2FE" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="waitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="People Count"
              stroke="#00F2FE"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#countGradient)"
            />
            <Area
              type="monotone"
              dataKey="wait"
              name="Est. Wait (min)"
              stroke="#0EA5E9"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#waitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
