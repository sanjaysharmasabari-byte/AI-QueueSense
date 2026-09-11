export type CongestionLevel = 'Low' | 'Medium' | 'High';

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export type UserRole = 'guest' | 'student' | 'staff' | 'admin';

export interface LocationItem {
  id: string;
  name: string;
  category: 'Dining' | 'Admin' | 'Academic' | 'Services' | 'Finance' | 'Transit';
  status: CongestionLevel;
  peopleCount: number;
  maxCapacity: number;
  estimatedWaitMin: number;
  queueDensityPercent: number;
  avgServiceTimeSec: number;
  lastUpdated: string;
  cameraCode: string;
  recommendedTimeWindow: string;
  queueGrowthPercent: number;
  serviceRatePeoplePerMin: number;
  mapX: number; // Percentage for SVG/interactive map
  mapY: number;
  description: string;
  hourlyTrends: { time: string; count: number; wait: number }[];
  weeklyTrends: { day: string; avgWait: number; peakPeople: number }[];
}

export interface CameraFeed {
  id: string;
  code: string;
  locationId: string;
  locationName: string;
  status: 'LIVE' | 'OFFLINE' | 'UNSTABLE';
  fps: number;
  queueRegionActive: boolean;
  resolution: string;
  detectedPeopleCount: number;
  modelConfidence: number;
  processingLatencyMs: number;
}

export interface SmartAlert {
  id: string;
  severity: AlertSeverity;
  type: 'CONGESTION' | 'WAIT_TIME' | 'IMPROVEMENT' | 'CAMERA_STATUS';
  locationId: string;
  locationName: string;
  timestamp: string;
  title: string;
  description: string;
  isRead: boolean;
}

export interface ThresholdSettings {
  lowMax: number;     // 0-30
  mediumMax: number;  // 31-60
  highMin: number;    // 61+
  alertSensitivity: 'low' | 'medium' | 'high';
  autoStaffNotification: boolean;
  emailAlertsEnabled: boolean;
}

export interface AIPredictionDetail {
  currentQueue: number;
  predictedWaitMin: number;
  next15MinWait: number;
  next30MinWait: number;
  trend: 'Increasing' | 'Decreasing' | 'Stable';
  confidenceScore: number; // e.g. 92%
  recommendedAction: string;
  aiExplanation: string;
}
