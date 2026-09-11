/**
 * AI QueueSense - Global Context Provider & Live Simulation Engine
 * 
 * NOTE: Contains the in-memory state management and ~3.5s randomized interval simulation
 * that perturbs location counts, updates camera feeds, and fires surge alerts.
 * All computer vision and AI forecasts are simulated for prototype demonstration.
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface QueueContextType {
  locations: LocationItem[];
  cameras: CameraFeed[];
  alerts: SmartAlert[];
  thresholds: ThresholdSettings;
  role: UserRole;
  demoMode: boolean;
  setRole: (role: UserRole) => void;
  setDemoMode: (enabled: boolean) => void;
  updateLocationCount: (id: string, newCount: number) => void;
  updateThresholds: (newThresholds: Partial<ThresholdSettings>) => void;
  markAlertRead: (id: string) => void;
  dismissAlert: (id: string) => void;
  clearAllAlerts: () => void;
  addAlert: (alert: Omit<SmartAlert, 'id' | 'timestamp' | 'isRead'>) => void;
  resetSimulation: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [cameras, setCameras] = useState<CameraFeed[]>(INITIAL_CAMERAS);
  const [alerts, setAlerts] = useState<SmartAlert[]>(INITIAL_ALERTS);
  const [thresholds, setThresholds] = useState<ThresholdSettings>(DEFAULT_THRESHOLDS);
  const [role, setRoleState] = useState<UserRole>('guest');
  const [demoMode, setDemoMode] = useState<boolean>(true);

  // Restore role from localStorage if present
  useEffect(() => {
    const savedRole = localStorage.getItem('queuesense_role') as UserRole;
    if (savedRole) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('queuesense_role', newRole);
  };

  const updateLocationCount = (id: string, newCount: number) => {
    setLocations((prev) =>
      prev.map((loc) => {
        if (loc.id === id) {
          const safeCount = Math.max(0, newCount);
          const newStatus = calculateCongestionLevel(safeCount, thresholds);
          const newDensity = calculateQueueDensity(safeCount, loc.maxCapacity);
          const newWait = estimateWaitTime(safeCount, loc.avgServiceTimeSec);

          return {
            ...loc,
            peopleCount: safeCount,
            status: newStatus,
            queueDensityPercent: newDensity,
            estimatedWaitMin: newWait,
            lastUpdated: 'Just now',
          };
        }
        return loc;
      })
    );
  };

  const updateThresholds = (newThresholds: Partial<ThresholdSettings>) => {
    setThresholds((prev) => {
      const updated = { ...prev, ...newThresholds };
      // Recalculate all location statuses with new thresholds
      setLocations((locs) =>
        locs.map((loc) => ({
          ...loc,
          status: calculateCongestionLevel(loc.peopleCount, updated),
        }))
      );
      return updated;
    });
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const addAlert = (alertData: Omit<SmartAlert, 'id' | 'timestamp' | 'isRead'>) => {
    const newAlert: SmartAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const resetSimulation = () => {
    setLocations(INITIAL_LOCATIONS);
    setCameras(INITIAL_CAMERAS);
    setAlerts(INITIAL_ALERTS);
    setThresholds(DEFAULT_THRESHOLDS);
  };

  // Demo Simulation Interval (runs every 3.5 seconds when demoMode is active)
  useEffect(() => {
    if (!demoMode) return;

    const interval = setInterval(() => {
      // Pick a random location to mutate slightly
      setLocations((prevLocations) => {
        const randomIndex = Math.floor(Math.random() * prevLocations.length);
        const target = prevLocations[randomIndex];
        
        // Random drift: -4 to +5
        const delta = Math.floor(Math.random() * 10) - 4;
        const newCount = Math.max(5, Math.min(85, target.peopleCount + delta));
        
        const newStatus = calculateCongestionLevel(newCount, thresholds);
        const newDensity = calculateQueueDensity(newCount, target.maxCapacity);
        const newWait = estimateWaitTime(newCount, target.avgServiceTimeSec);

        // Check if status changed to HIGH -> Trigger an alert
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

        // Update corresponding camera feed detected count
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
        setRole,
        setDemoMode,
        updateLocationCount,
        updateThresholds,
        markAlertRead,
        dismissAlert,
        clearAllAlerts,
        addAlert,
        resetSimulation,
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
