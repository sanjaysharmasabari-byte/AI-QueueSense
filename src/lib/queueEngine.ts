import { CongestionLevel, LocationItem, AIPredictionDetail, ThresholdSettings } from './types';

export function calculateCongestionLevel(
  peopleCount: number,
  thresholds: ThresholdSettings
): CongestionLevel {
  if (peopleCount <= thresholds.lowMax) return 'Low';
  if (peopleCount <= thresholds.mediumMax) return 'Medium';
  return 'High';
}

export function calculateQueueDensity(peopleCount: number, maxCapacity: number): number {
  if (maxCapacity <= 0) return 0;
  return Math.min(100, Math.round((peopleCount / maxCapacity) * 100));
}

export function estimateWaitTime(
  peopleCount: number,
  avgServiceTimeSec: number = 20,
  activeCounters: number = 2
): number {
  if (peopleCount <= 0) return 0;
  // total seconds needed = (peopleCount * avgServiceTimeSec) / activeCounters
  const totalSeconds = (peopleCount * avgServiceTimeSec) / activeCounters;
  return Math.max(1, Math.round(totalSeconds / 60));
}

export function getAIPrediction(location: LocationItem): AIPredictionDetail {
  const count = location.peopleCount;
  const wait = location.estimatedWaitMin;
  const growth = location.queueGrowthPercent;

  let trend: 'Increasing' | 'Decreasing' | 'Stable' = 'Stable';
  if (growth > 4) trend = 'Increasing';
  else if (growth < -4) trend = 'Decreasing';

  const next15MinWait = Math.max(
    1,
    Math.round(wait * (1 + (growth / 100) * 0.75))
  );
  const next30MinWait = Math.max(
    1,
    Math.round(wait * (1 + (growth / 100) * 1.25))
  );

  let confidenceScore = 94; // AI Confidence metric
  if (location.cameraCode === 'CAM-04') confidenceScore = 86; // FPS drop

  let recommendedAction = 'Maintain standard queue operations.';
  if (location.status === 'High') {
    recommendedAction =
      'Consider opening an auxiliary service counter or reallocating staff during the current surge.';
  } else if (location.status === 'Medium' && trend === 'Increasing') {
    recommendedAction =
      'Prepare secondary line stanchions and monitor inflow speed over the next 15 minutes.';
  }

  const aiExplanation = `AI-assisted prediction based on current density (${location.queueDensityPercent}%), computer vision inflow velocity (${growth > 0 ? '+' : ''}${growth}%), and historical ${location.name} rush-hour patterns.`;

  return {
    currentQueue: count,
    predictedWaitMin: wait,
    next15MinWait,
    next30MinWait,
    trend,
    confidenceScore,
    recommendedAction,
    aiExplanation,
  };
}
