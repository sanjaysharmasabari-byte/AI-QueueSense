'use client';

import React from 'react';
import { LocationItem } from '@/lib/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

interface LocationCompareChartProps {
  locations: LocationItem[];
  height?: number;
}

export const LocationCompareChart: React.FC<LocationCompareChartProps> = ({
  locations,
  height = 280,
}) => {
  const chartData = locations.map((loc) => ({
    name: loc.name,
    people: loc.peopleCount,
    wait: loc.estimatedWaitMin,
    status: loc.status,
  }));

  const getBarColor = (status: string) => {
    if (status === 'High') return '#EF4444';
    if (status === 'Medium') return '#F59E0B';
    return '#14B8A6';
  };

  return (
    <div className="w-full">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
        Campus Queue Load Comparison
      </h4>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
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
            <Bar dataKey="people" name="Current Queue Count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
