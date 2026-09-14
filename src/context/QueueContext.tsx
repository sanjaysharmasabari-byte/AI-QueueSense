/**
 * AI QueueSense - Global Context Provider with Supabase Database Sync & Live Simulation
 * 
 * Synchronizes queue states, cameras, smart alerts, and thresholds with Supabase PostgreSQL,
 * with real-time UI state updates and fallback simulation capabilities.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  LocationItem,
  CameraFeed,
  SmartAlert,
  ThresholdSettings,
  UserRole,
} from '@/lib/types';
import {
  INITIAL_LOCATIONS,
  INITIAL_CAMERAS,
  INITIAL_ALERTS,
  DEFAULT_THRESHOLDS,
} from '@/lib/mockData';
import { calculateCongestionLevel, calculateQueueDensity, estimateWaitTime } from '@/lib/queueEngine';

export type ThemeMode = 'dark' | 'light';

interface QueueContextType {
  locations: LocationItem[];
  cameras: CameraFeed[];
  alerts: SmartAlert[];
  thresholds: ThresholdSettings;
  role: UserRole;
  demoMode: boolean;
  theme: ThemeMode;
  isLoading: boolean;
  setRole: (role: UserRole) => void;
  setDemoMode: (enabled: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  updateLocationCount: (id: string, newCount: number) => Promise<void>;
  updateThresholds: (newThresholds: Partial<ThresholdSettings>) => Promise<void>;
  markAlertRead: (id: string) => Promise<void>;
  dismissAlert: (id: string) => Promise<void>;
  clearAllAlerts: () => Promise<void>;
  addAlert: (alert: Omit<SmartAlert, 'id' | 'timestamp' | 'isRead'>) => Promise<void>;
  resetSimulation: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [cameras, setCameras] = useState<CameraFeed[]>(INITIAL_CAMERAS);
  const [alerts, setAlerts] = useState<SmartAlert[]>(INITIAL_ALERTS);
  const [thresholds, setThresholds] = useState<ThresholdSettings>(DEFAULT_THRESHOLDS);
  const [role, setRoleState] = useState<UserRole>('guest');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch initial data from Supabase backend
  const refreshData = useCallback(async () => {
    try {
      const [locRes, camRes, alertRes, threshRes] = await Promise.all([
        fetch('/api/locations'),
        fetch('/api/cameras'),
        fetch('/api/alerts'),
        fetch('/api/thresholds'),
      ]);

      if (locRes.ok) {
        const locData = await locRes.json();
        if (Array.isArray(locData) && locData.length > 0) setLocations(locData);
      }
      if (camRes.ok) {
        const camData = await camRes.json();
        if (Array.isArray(camData) && camData.length > 0) setCameras(camData);
      }
      if (alertRes.ok) {
        const alertData = await alertRes.json();
        if (Array.isArray(alertData)) setAlerts(alertData);
      }
      if (threshRes.ok) {
        const threshData = await threshRes.json();
        if (threshData && !threshData.error) setThresholds(threshData);
      }
    } catch (err) {
      console.warn('Could not fetch initial state from Supabase API, using baseline fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Restore role & theme from localStorage if present
  useEffect(() => {
    const savedRole = localStorage.getItem('queuesense_role') as UserRole;
    if (savedRole) {
      setRoleState(savedRole);
    }

    const savedTheme = localStorage.getItem('queuesense_theme') as ThemeMode;
    if (savedTheme) {
      setThemeState(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('queuesense_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('queuesense_role', newRole);
  };

  const updateLocationCount = async (id: string, newCount: number) => {
    const safeCount = Math.max(0, newCount);
    const targetLoc = locations.find((l) => l.id === id);
    if (!targetLoc) return;

    const newStatus = calculateCongestionLevel(safeCount, thresholds);
    const newDensity = calculateQueueDensity(safeCount, targetLoc.maxCapacity);
    const newWait = estimateWaitTime(safeCount, targetLoc.avgServiceTimeSec);

    const updatedPayload = {
      id,
      peopleCount: safeCount,
      status: newStatus,
      queueDensityPercent: newDensity,
      estimatedWaitMin: newWait,
      lastUpdated: 'Just now',
    };

    // Optimistic UI update
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, ...updatedPayload } : loc))
    );

    // Sync with Supabase
    try {
      await fetch('/api/locations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });
    } catch (err) {
      console.error('Failed to sync location update to Supabase:', err);
    }
  };

  const updateThresholds = async (newThresholds: Partial<ThresholdSettings>) => {
    const merged = { ...thresholds, ...newThresholds };

    // Optimistic UI update
    setThresholds(merged);
    setLocations((locs) =>
      locs.map((loc) => ({
        ...loc,
        status: calculateCongestionLevel(loc.peopleCount, merged),
      }))
    );

    // Sync with Supabase
    try {
      await fetch('/api/thresholds', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });
    } catch (err) {
      console.error('Failed to sync thresholds to Supabase:', err);
    }
  };

  const markAlertRead = async (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );

    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: true }),
      });
    } catch (err) {
      console.error('Failed to mark alert as read in Supabase:', err);
    }
  };

  const dismissAlert = async (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));

    try {
      await fetch(`/api/alerts?id=${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to dismiss alert in Supabase:', err);
    }
  };

  const clearAllAlerts = async () => {
    setAlerts([]);

    try {
      await fetch('/api/alerts', {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to clear all alerts in Supabase:', err);
    }
  };

  const addAlert = async (alertData: Omit<SmartAlert, 'id' | 'timestamp' | 'isRead'>) => {
    const newAlert: SmartAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };

    setAlerts((prev) => [newAlert, ...prev]);

    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlert),
      });
    } catch (err) {
      console.error('Failed to add alert to Supabase:', err);
    }
  };

  const resetSimulation = async () => {
    setLocations(INITIAL_LOCATIONS);
    setCameras(INITIAL_CAMERAS);
    setAlerts(INITIAL_ALERTS);
    setThresholds(DEFAULT_THRESHOLDS);

    try {
      await refreshData();
    } catch (err) {
      console.error('Failed to reset simulation:', err);
    }
  };

  // Demo Simulation Interval (runs every 3.5 seconds when demoMode is active)
  useEffect(() => {
    if (!demoMode) return;

    const interval = setInterval(() => {
      setLocations((prevLocations) => {
        if (prevLocations.length === 0) return prevLocations;
        const randomIndex = Math.floor(Math.random() * prevLocations.length);
        const target = prevLocations[randomIndex];
        
        const delta = Math.floor(Math.random() * 10) - 4;
        const newCount = Math.max(5, Math.min(85, target.peopleCount + delta));
        
        const newStatus = calculateCongestionLevel(newCount, thresholds);
        const newDensity = calculateQueueDensity(newCount, target.maxCapacity);
        const newWait = estimateWaitTime(newCount, target.avgServiceTimeSec);

        if (target.status !== 'High' && newStatus === 'High') {
          addAlert({
            severity: 'critical',
            type: 'CONGESTION',
            locationId: target.id,
            locationName: target.name,
            title: `SURGE ALERT: ${target.name.toUpperCase()}`,
            description: `${target.name} queue reached ${newCount} people. Density is now ${newDensity}%.`,
          });
        }

        setCameras((cams) =>
          cams.map((c) =>
            c.locationId === target.id
              ? { ...c, detectedPeopleCount: newCount }
              : c
          )
        );

        return prevLocations.map((loc, idx) => {
          if (idx === randomIndex) {
            return {
              ...loc,
              peopleCount: newCount,
              status: newStatus,
              queueDensityPercent: newDensity,
              estimatedWaitMin: newWait,
              queueGrowthPercent: delta > 0 ? delta * 3 : delta * 2,
              lastUpdated: 'Just now',
            };
          }
          return loc;
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [demoMode, thresholds]);

  return (
    <QueueContext.Provider
      value={{
        locations,
        cameras,
        alerts,
        thresholds,
        role,
        demoMode,
        theme,
        isLoading,
        setRole,
        setDemoMode,
        setTheme,
        toggleTheme,
        updateLocationCount,
        updateThresholds,
        markAlertRead,
        dismissAlert,
        clearAllAlerts,
        addAlert,
        resetSimulation,
        refreshData,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
