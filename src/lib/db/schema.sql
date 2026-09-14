-- AI QueueSense Schema for Supabase / PostgreSQL

CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  people_count INTEGER NOT NULL DEFAULT 0,
  max_capacity INTEGER NOT NULL DEFAULT 100,
  estimated_wait_min INTEGER NOT NULL DEFAULT 0,
  queue_density_percent INTEGER NOT NULL DEFAULT 0,
  avg_service_time_sec INTEGER NOT NULL DEFAULT 0,
  last_updated TEXT NOT NULL,
  camera_code TEXT NOT NULL,
  recommended_time_window TEXT NOT NULL,
  queue_growth_percent NUMERIC NOT NULL DEFAULT 0,
  service_rate_people_per_min NUMERIC NOT NULL DEFAULT 0,
  map_x NUMERIC NOT NULL DEFAULT 0,
  map_y NUMERIC NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  hourly_trends JSONB DEFAULT '[]'::jsonb,
  weekly_trends JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cameras (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  location_id TEXT REFERENCES locations(id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  status TEXT NOT NULL,
  fps NUMERIC NOT NULL DEFAULT 0,
  queue_region_active BOOLEAN NOT NULL DEFAULT TRUE,
  resolution TEXT NOT NULL,
  detected_people_count INTEGER NOT NULL DEFAULT 0,
  model_confidence NUMERIC NOT NULL DEFAULT 0,
  processing_latency_ms INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  severity TEXT NOT NULL,
  type TEXT NOT NULL,
  location_id TEXT NOT NULL,
  location_name TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS thresholds (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  low_max INTEGER NOT NULL DEFAULT 30,
  medium_max INTEGER NOT NULL DEFAULT 60,
  high_min INTEGER NOT NULL DEFAULT 61,
  alert_sensitivity TEXT NOT NULL DEFAULT 'medium',
  auto_staff_notification BOOLEAN NOT NULL DEFAULT TRUE,
  email_alerts_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'student',
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
